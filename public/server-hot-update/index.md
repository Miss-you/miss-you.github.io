# 从 nginx 热更新聊一聊 Golang 中的热更新


# 从 nginx 热更新聊一聊 Golang 中的热更新

> 静态语言在服务器编程时都会遇到这样的问题：如何保证已有的连接服务不中断同时又升级版本？
> 最近花了点时间看了下 nginx 热更新代码流程，想了下结合之前的经验一并总结下热更新

## 热更新是什么？

举个例子，你现在在坐卡车，卡车开到了 150KM/H

然后，有个轮胎，爆了

然后，司机说，你就直接换吧，我不停车。你小心点换

嗯。就这个意思   

## 网关中的热更新

服务程序热更新这个问题在层 7 网关中尤其严重，网关中承载着大量的请求，包括 HTTP/HTTPS 短连接、HTTP/HTTPS 长连接、甚至是 websocket 这种超长连接（websocket 通常连接时间会很长，十几分钟到几天不等）。服务进程热更新是非常有必要的。

网关作为一个基础组件，需要保证高可用，是很难将其先停下来再更新的；

有人说可以使用负载均衡将需要更新的组件先隔离，再停机更新，但是如果是一个很小的集群没有负载均衡呢，又或者这样手动一台一台升级也着实麻烦，部分情况下就算隔离了也不过是不会有新的连接过来，旧的连接/请求依旧需要处理完成，否则就会造成部分服务不可用

> 不过实际上线上操作是集群隔离加热更新一起操作

## nginx 热更新 (Upgrading Executable on the Fly)

nginx [engine x] 是 Igor Sysoev 编写的一个 HTTP 和反向代理服务器，另外它也可以作为邮件代理服务器。 它已经在众多流量很大的俄罗斯网站上使用了很长时间，这些网站包括 Yandex、Mail.Ru、VKontakte，以及 Rambler。据 Netcraft 统计，在 2012 年 8 月份，世界上最繁忙的网站中有 11.48%使用 Nginx 作为其服务器或者代理服务器。

> NginX 采用 Master/Worker 的多进程模型，Master 进程负责整个 NginX 进程的管理。Nginx 的模块化、热更新、Http 处理流程、日志等机制都非常经典。这里将会简要介绍一下热更新的机制

### nginx 热升级流程

步骤 1、升级 nginx 二进制文件，需要先将新的 nginx 可执行文件替换原有旧的 nginx 文件，然后给 nginx master 进程发送 USR2 信号，告知其开始升级可执行文件；nginx master 进程会将老的 pid 文件增加。oldbin 后缀，然后拉起新的 master 和 worker 进程，并写入新的 master 进程的 pid。

```
UID        PID  PPID  C STIME TTY          TIME CMD
root      4584     1  0 Oct17 ?        00:00:00 nginx: master process /usr/local/apigw/apigw_nginx/nginx
root     12936  4584  0 Oct26 ?        00:03:24 nginx: worker process
root     12937  4584  0 Oct26 ?        00:00:04 nginx: worker process
root     12938  4584  0 Oct26 ?        00:00:04 nginx: worker process
root     23692  4584  0 21:28 ?        00:00:00 nginx: master process /usr/local/apigw/apigw_nginx/nginx
root     23693 23692  3 21:28 ?        00:00:00 nginx: worker process
root     23694 23692  3 21:28 ?        00:00:00 nginx: worker process
root     23695 23692  3 21:28 ?        00:00:00 nginx: worker process
```

步骤 2、在此之后，所有工作进程（包括旧进程和新进程）将会继续接受请求。这时候，需要发送 WINCH 信号给 nginx master 进程，master 进程将会向 worker 进程发送消息，告知其需要进行 graceful shutdown，worker 进程会在连接处理完之后进行退出。

```
UID        PID  PPID  C STIME TTY          TIME CMD
root      4584     1  0 Oct17 ?        00:00:00 nginx: master process /usr/local/apigw/apigw_nginx/nginx
root     12936  4584  0 Oct26 ?        00:03:24 nginx: worker process
root     12937  4584  0 Oct26 ?        00:00:04 nginx: worker process
root     12938  4584  0 Oct26 ?        00:00:04 nginx: worker process
root     23692  4584  0 21:28 ?        00:00:00 nginx: master process /usr/local/apigw/apigw_nginx/nginx
#若旧的 worker 进程还需要处理连接，则 worker 进程不会立即退出，需要待消息处理完后再退出
```

步骤 3、经过一段时间之后，将会只会有新的 worker 进程处理新的连接。

> 注意，旧 master 进程并不会关闭它的 listen socket；因为如果出问题后，需要回滚，master 进程需要法重新启动它的 worker 进程。

步骤 4、如果升级成功，则可以向旧 master 进程发送 QUIT 信号，停止老的 master 进程；如果新的 master 进程（意外）退出，那么旧 master 进程将会去掉自己的 pid 文件的。oldbin 后缀。

### nginx 热更新相关信号

master 进程相关信号

```
USR2	升级可执行文件
WINCH	优雅停止 worker 进程
QUIT	优雅停止 master 进程
```

worker 进程相关信号

```
TERM, INT	快速退出进程
QUIT	优雅停止进程
```

### nginx 相关代码走读

#### 1、USR2 流程

![在这里插入图片描述](https://img-blog.csdnimg.cn/20181029211941159.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE1NDM3NjY3,size_16,color_FFFFFF,t_70)

master 收到 USR2 信号后，会拉起新的 master nginx 进程；

新的 master 进程拉起新的 worker 进程；

最终，老的 worker 进程和新的 worker 进程共用一个 listen socket，接受连接

> 若打开了 REUSEPORT 开关，则 socket 继承情况会有些区别，感兴趣的可以自行翻看代码

#### 2、WINCH 流程

![在这里插入图片描述](https://img-blog.csdnimg.cn/20181030095755923.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE1NDM3NjY3,size_16,color_FFFFFF,t_70)

master 进程收到 WINCH 信号后，会给各个 worker 进程发送 QUIT 信号，让其优雅退出；master 进程并不再处理新的连接。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20181030105115956.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE1NDM3NjY3,size_16,color_FFFFFF,t_70)

worker graceful shutdown 流程，关闭 listen socket，不再处理新的连接；待已有连接处理完后，清理连接，退出进程。

#### 3、QUIT 流程

master graceful shutdown 流程，没什么好说的

### nginx 升级过程中若出现问题如何回滚？

### nginx 热升级 QA

**1、如何防止多次可执行文件触发热更新？**

```
相关代码
ngx_signal_handler
-->
case ngx_signal_value(NGX_CHANGEBIN_SIGNAL):
    if (ngx_getppid() == ngx_parent || ngx_new_binary > 0) {

        /*
            * Ignore the signal in the new binary if its parent is
            * not changed, i.e. the old binary's process is still
            * running.  Or ignore the signal in the old binary's
            * process if the new binary's process is already running.
            */

        action = ", ignoring";
        ignore = 1;
        break;
    }

    ngx_change_binary = 1;
    action = ", changing binary";
    break;
```

若老的 nginx 还在，nginx 无法进行热更新二进制文件

**2、nginx 升级过程中，发现新的可执行文件出现问题该如何回滚？**

- a、向旧 master 进程发送 HUP 信号。旧进程将启动新的 worker 进程，而且不会重新读取配置。之后，通过向新的主 master 进程发送 QUIT 信号，可以优雅地关闭新的 master 和 worker 进程。
- b、将 TERM 信号发送到新的 master 进程，然后新的 master 进程将向其 worker 进程发送一条消息，让它们立即退出，这种退出不是 graceful shutdown。当新的 master 进程退出时，旧的 master 进程将启动新的 worker 进程。
- c、如果新的进程没有退出，则应该向它们发送终止 KILL 信号。当新的 master 进程退出时，旧的 master 进程将启动新的工作进程。

**3、什么是 graceful shutdown**

本文中的 graceful shutdown 是指 server 不再处理新的连接，但是进程不会立即退出，待所有连接断开后再退出进程。

### 总结一下个人在 nginx 二进制文件热升级时用的命令

```
cd /usr/local/nginx
cp nginx nginx_bak 
mv /data/nginx/nginx ./nginx #需要使用 mv 来更新二进制文件
./nginx -t #尝试启动，查看其加载配置文件等初始化功能是否正常

netstat -anp | grep -E "80|443" | grep nginx #检查连接状态
kill -USR2 `cat /usr/local/nginx/nginx.pid` #升级 nginx 可执行文件，此时会有两组 nginx master 和 worker 进程
kill -WINCH `cat /usr/local/nginx/nginx.pid.oldbin` #新的可执行文件启动 ok，且能够正常处理数据流，告知老的 master 进程去通知其 worker 进程进行优雅退出

...
kill -QUIT `cat /usr/local/nginx/nginx.pid.oldbin` #待所有的老的 nginx worker 进程优雅退出后（处理完连接），停止老的 master 进程
```

> TODO：nginx 还会有依赖的 so 文件的热升级--其实更应该属于后台进程的 so 文件热升级流程，我在使用它的时候也踩过坑--主要原因还是操作不规范，对 so 其加载运行原理不够熟悉导致

## 热升级

实际上，静态语言后端 server 有一套固定的热升级（单进程）流程，其基本流程如下：

> 若需要支持热升级的是多进程，那么 nginx 的热升级过程是最值得参考的

- 1、通过调用 fork/exec 启动新的版本的进程， 

- 2、子进程调用接口获取从父进程继承的 socket 文件描述符重新监听 socket

- 3、在此过程中，不会对用户请求造成任何中断。

nginx 的热升级流程也是类似，只不过由于 nginx 工作是多进程，故它会先启动新版本的一组 master/worker 进程；

然后停止老的 worker 进程，让其不处理连接，由新的 worker 进程来处理连接；

升级完毕后，即可退出老的 master 进程，热升级完成。

## 热更新

热更新目标：

- 1、正在处理中的连接/服务/请求不能立即中断，需要继续提供服务
- 2、socket 对用户来说要保持可用，可以接受新的请求

直接沿用上篇的思路，热更新（单进程）流程，其基本流程如下：

- 1、用新的 bin 文件去替换老的 bin 文件
- 2、发送信号告知 server 进程（通常是 USR2 信号），进行平滑升级
- 3、server 进程收到信号后，通过调用 fork/exec 启动新的版本的进程
- 4、子进程调用接口获取从父进程继承的 socket 文件描述符重新监听 socket
- 5、老的进程不再接受请求，待正在处理中的请求处理完后，进程自动退出
- 6、子进程托管给 init 进程

我们可以按照这个思路完成一个简单的可以热更新的 http server

### 简易的 http server

首先，我们需要一个最简单的 http server

```
func main() {
	fmt.Println("Hello World!")
    var err error

    // 注册 http 请求的处理方法
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello world!"))
	})

    // 在 8086 端口启动 http 服务，其内部有一个循环 accept 8086 端口
    // 每当新的 HTTP 请求过来则开一个协程处理
    err = http.ListenAndServe("localhost:8086", nil)
    if err != nil {
        log.Println(err)
    }

}
```

### fork 一个新的进程

在 go 语言里面可以有很多种方法 fork 一个新的进程，但是在这里我更倾向于推荐 exec.Command 接口来启动一个新的进程。因为 Cmd struct 中有一个 ExtraFiles 变量，子进程可以通过它直接继承文件描述符 fd。

```
func forkProcess() error {
	var err error
	files := []*os.File{gListen.File()} //demo only one //.File()
	path := "/Users/yousa/work/src/graceful-restart-demo/graceful-restart-demo"
	args := []string{
		"-graceful",
	}

	env := append(
		os.Environ(),
		"ENDLESS_CONTINUE=1",
	)
	env = append(env, fmt.Sprintf(`ENDLESS_SOCKET_ORDER=%s`, "0,127.0.0.1"))

	cmd := exec.Command(path, args...)
	//cmd := exec.Command(path, "-graceful", "true")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.ExtraFiles = files
	cmd.Env = env

	err = cmd.Start()
	if err != nil {
		log.Fatalf("Restart: Failed to launch, error: %v", err)
		return err
	}

	return nil
}
```

代码浅析：

在上面的 files 是存储父进程的文件描述符，path 的内容是新的要替换的可执行文件的路径。

重要的一点是，.File() 返回一个 [dup(2)](http://pubs.opengroup.org/onlinepubs/009695399/functions/dup.html) 的文件描述符。这个重复的文件描述符不会设置 FD_CLOEXEC 标志，这个文件描述符操作容易出错，容易被在子进程中被错误关闭。

在其他语言（或者 go 里面）里面你可能通过使用命令行将文件描述符传递给子进程，在这里比较推荐使用 ExtraFile 传递 fd。不过 ExtraFiles 在 windows 中不支持。

args 中传递的-graceful 参数是告诉子进程这是优雅热升级的一部分，这样子进程可以通过它知道，自己需要重用套接字而不是重新打开一个新的套接字

### 子进程初始化

```
func main() {
	fmt.Println("Hello World!")

	...
		
    var gracefulChild bool
	var netListen net.Listener
	var err error
	args := os.Args
	...

    if len(args) > 1 && args[1] == "-graceful" {
		gracefulChild = true
	} else {
		gracefulChild = false
	}

	fmt.Println("gracefulChild:", gracefulChild)

    if gracefulChild {
		//重用套接字
        log.Print("main: Listening to existing file descriptor 3.")
        f := os.NewFile(3, "")
		netListen, err = net.FileListener(f)
    } else {
        log.Print("main: Listening on a new file descriptor.")
        netListen, err = net.Listen("tcp", gServer.Addr)
	}
	if err != nil {
		log.Fatal(err)
		return
	}
    
    ...
}
```

args 用于解析入参，gracefulChild 表示进程自己是否是子进程（对应到 fork 中的-graceful）（这里更推荐 flag.BoolVar，但是写 demo 的时候使用起来有些问题，故临时使用 args）

net.FileListener 重用套接字，ExtraFiles 中传递的套接字，从 idx 3 的位置开始获取。

### 给父进程发送信号停止父进程

```
func main() {
	//init
	...
	
	if gracefulChild {
		syscall.Kill(syscall.Getppid(), syscall.SIGTERM)
		log.Println("Graceful shutdown parent process.")
	}
	
	//start http server.
	...
}
```

给父进程发送 graceful shutdown 信号

### 优雅停止父进程

> 等待请求超时或者处理完成退出进程

第一眼给人感觉，不知道该如何下手做热升级。

我们需要去跟踪连接，故想到的是有没有钩子函数来解决连接的 accept 和 close，让人觉得 Golang 标准 http 包没有提供任何钩子来处理 Accept() 和 Close()，这里恰恰是 golang 的 interface 的魅力所在。

> interface 基础知识请自行补充

我们需要一个 sync.WaitGroup 来跟踪已经打开的连接，每新 accept 一个连接则让其加一，每当连接断开则减一。定义一个 listener struct 并实现相应的 Accept()、Close()、Addr() 等方法。

```
type demoListener struct {
	net.Listener
	stopped bool
	stop    chan error
}

func newDemoListener(listen net.Listener) (demoListen *demoListener) {
	demoListen = &demoListener{
		Listener: listen,
		stop: make(chan error),
	}

	return
}

func (listen *demoListener) Accept() (conn net.Conn, err error) {
	conn, err = listen.Listener.Accept()
	if err != nil {
		return
	}

	conn = demoConn{Conn: conn}
	gWg.Add(1)
	return
}

func (listen *demoListener) Close() error {
	if listen.stopped {
		return syscall.EINVAL
	}

	listen.stopped = true 
	return listen.Listener.Close() //停止接受新的连接
}

//get fd
func (listen *demoListener) File() *os.File {
	// returns a dup(2) - FD_CLOEXEC flag *not* set
	tcpListen := listen.Listener.(*net.TCPListener)
	fd, _ := tcpListen.File()
	return fd
}
```

demoListener 定义的时候，通过匿名结构体（可以理解为是一种组合），继承了 net.Listener 的结构和方法，下面的 Accept 和 Close 则重载了 net.Listener 的 Accept 和 Close 方法。

Listener 在每个 Accept() 上都增加了一个等待组。

newDemoListener() 是 Listener 的构造函数。

File() 方法是从 Listener 中获取文件描述符 fd

当然，我们需要重载连接 net.Conn 的 Close() 方法，在连接断开时，将 wg 减一

```
type demoConn struct {
	net.Conn
}

func (conn demoConn) Close() error {
	err := conn.Conn.Close()
	if err == nil {
		gWg.Done()
	}

    return nil
}
```

最后，有可能客户端已经很长时间不发消息了，但是他不主动断开连接；为了避免这种情况，server 端通常认为这种是连接超时，在一定时间后会将连接关闭，故初始化 http.Server 时比较建议这样：

```
	gServer = &http.Server{
        Addr:           "0.0.0.0:8086",
        ReadTimeout:    60 * time.Second,
        WriteTimeout:   60 * time.Second,
		MaxHeaderBytes: 1 << 16,
		Handler:		demoHandler{},
	}

```

> **注意：若使用的 go 版本在 1.8 版本以上（包括），http 包已经支持优雅退出，直接调用 Shutdown() 接口即可，更为简单。**

**关闭 listener 连接和监控信号的部分这里便不再赘述，文末附有源码，有兴趣可以看看。**

测试结果：

启动 server，发送 http 请求

```
YOUSALI-MB0:~ yousa$ curl -i http://localhost:8086
HTTP/1.1 200 OK
Date: Mon, 05 Nov 2018 08:11:17 GMT
Content-Length: 17
Content-Type: text/plain; charset=utf-8

Hello Tencent!
```

发送 usr2 信号给 server

```
YOUSALI-MB0:graceful-restart-demo yousa$ ps -ef | grep grace
  501 50199 41134   0  4:10 下午 ttys002    0:00.01 ./graceful-restart-demo
  501 50252 44808   0  4:11 下午 ttys003    0:00.00 grep grace
YOUSALI-MB0:graceful-restart-demo yousa$ kill -USR2 50199
YOUSALI-MB0:graceful-restart-demo yousa$ ps -ef | grep grace
  501 50253     1   0  4:11 下午 ttys002    0:00.01 /Users/yousa/work/src/graceful-restart-demo/graceful-restart-demo -graceful
  501 51460 44808   0  4:37 下午 ttys003    0:00.00 grep grace
  
## 终端打印
Hello World!
gracefulChild: false
2018/11/05 16:10:16 main: Listening on a new file descriptor.
2018/11/05 16:11:10 50199 Received SIGUSR2.
Hello World!
gracefulChild: true
2018/11/05 16:11:10 main: Listening to existing file descriptor 3.
2018/11/05 16:11:10 Graceful shutdown parent process.
2018/11/05 16:11:10 50199 Received SIGTERM.

```

待升级后发送消息

```
YOUSALI-MB0:~ yousa$ curl -i http://localhost:8086
HTTP/1.1 200 OK
Date: Mon, 05 Nov 2018 08:11:44 GMT
Content-Length: 14
Content-Type: text/plain; charset=utf-8

Happy 20th birthday!
```

### 遇到的问题

1、翻了下代码，并没有看到父进程如何退出？是怎样的流程？

先看一下 http ListenAndServe 接口，它会调用 net.Listen 和 serve.Serve 两个函数，net.Listen 是 listen 端口。

Serve 代码如下，它是一个 for 循环，Accept 一个新的连接后会用一个新的协程来处理请求；当 listen 的端口被关闭或者异常后，该 Serve 循环便会跳出

> 另外，也可以在这里看到，如果让 http server 接入协程池则可以重载 http.Server 的 Serve，在收到新的连接后，从协程池中分配一个协程供新的连接使用。

```
func (srv *Server) Serve(l net.Listener) error {
	defer l.Close()
	var tempDelay time.Duration // how long to sleep on accept failure
	for {
		rw, e := l.Accept()
		if e != nil {
			if ne, ok := e.(net.Error); ok && ne.Temporary() {
				if tempDelay == 0 {
					tempDelay = 5 * time.Millisecond
				} else {
					tempDelay *= 2
				}
				if max := 1 * time.Second; tempDelay > max {
					tempDelay = max
				}
				srv.logf("http: Accept error: %v; retrying in %v", e, tempDelay)
				time.Sleep(tempDelay)
				continue
			}
			return e
		}
		tempDelay = 0
		c, err := srv.newConn(rw)
		if err != nil {
			continue
		}
		c.setState(c.rwc, StateNew) // before Serve can return
		go c.serve()
	}
}
```

再看一下 shutdownProcess 函数，故在这里关闭 listen socket 后，http Serve 处理请求的主循环便会退出

```
func shutdownProcess() error {
	gServer.SetKeepAlivesEnabled(false)
	gListen.Close()
	log.Println("shutdownProcess success.")
	return nil
}
```

将 listen socket 关闭后，main 函数中的 gServer.Serve(gListen) 便会退出，但实际上已有的连接/服务并没有处理完成，需要使用 waitgroup 等待连接处理完成后，进程再退出。

## github 上的已有开源方案

解决 golang http server 热更新问题，有了基本的思路之后，想到的是去 github 看下有没有稳定的解决方案。找到了如下三个库：

- [fvbock/endless](https://github.com/fvbock/endless) - Zero downtime restarts for golang HTTP and HTTPS servers. (for golang 1.3+)
- [facebookgo/grace](https://github.com/facebookgo/grace) - Grace provides a library that makes it easy to build socket based servers that can be gracefully terminated & restarted (that is, without dropping any connections).
- [jpillora/overseer](https://github.com/jpillora/overseer) - Overseer is a package for creating monitorable, gracefully restarting, self-upgrading binaries in Go (golang)

> 其实除了这些外，还有一些支持热更新的库，但是更新时间过老，在这里就不作讨论了。
> 当然，非常火爆的框架比如 beego 等，也支持热升级/gracefun shutdown，但是由于嵌入到了 beego 中，故本章中不作讨论，有兴趣的可以自行去看看。

### 实现浅析

我们使用官方的例子来简单分析其流程并简单比较其异同

#### 1、各个开源库 demo 代码

demo 代码较为冗长，很影响阅读观感，故贴在了最后的附录中

#### 2、对比

操作步骤：

- 编译 demo 示例，启动示例进程，记录其 pid
- 修改内容 (Hello Tencent 初始内容，修改为 Happy 20th Birthday！且请求处理均需要 sleep 10-20 秒），重新构建。
- 发送请求，发送热升级信号，再发送请求，对比两次请求内容
- 对比进程热升级前后的 pid，是否与之前一致

结果对比

|第三方库|第一次请求返回|第二次请求返回|操作前进程 pid|操作后进程 pid|
|---|---|---|---|---|
|facebookgo/grace|Hello Tencent|Happy 20th Birthday！|41992|41998|
|fvbock/endless|Hello Tencent|Happy 20th Birthday！|41200|41520|
|jpillora/overseer|Hello Tencent|Happy 20th Birthday！|43424|43424|

原理浅析：

grace 和 endless 的热升级方法与本文重点讲述的方法一致，基本是 fork 一个子进程，子进程 listen 端口，父进程优雅退出，这里便不再赘述

> overseer 的热升级与 grace/endless 有些不同，由于作者很久不更新了（差不多 1-2 年），也找不到比较好的介绍文章，故这里只能简要贴一下其 github 上对 overseer 的原理介绍。由于不是本文核心介绍内容，放在附录中。
> overseer 用一个主进程管理平滑重启，子进程处理连接，保持主进程 pid 不变；

优缺点对比： 

- grace 库支持 net tcp 热升级以及 http 热升级，endless 仅支持 http 热升级
- grace 库接入第三方 http server 较麻烦（比如 fasthttp、gin 等）；endless 接入则只需要替换 ListenAndServe 即可（endless 继承/重写了 Serve 方法），通用性更好
- grace 库功能强大，但是稍微复杂；endless 库更为简洁

由于我的项目使用了 gin 作为 http 框架，故考虑到快速集成，我选择了 endless 该框架

> 第三方库的对比经验：
> 主观因素：个人品味，是否要自己造轮子，朋友的推荐也对个人的判断也有很大影响；
> 客观因素：集成复杂度，内存管理，是否有大量 I/O 访问/耗性能访问，错误处理，工具参考文档等。

集成起来也非常方便，类似于如下：

```
func main() {
	router := gin.Default()
	router.GET("/", handler)
	// [...]
	endless.ListenAndServe(":8086", router)
}
```

### 问题拓展

我其实又想了这些问题，也想抛出来与大家一起讨论

1、简单的 http server 很容易升级，若监听了多个端口该如何进行热升级？

2、若 go server 使用 tls 服务（其他也类似），如何进行升级？

3、go http server 在容器场景下是否需要平滑热升级？平滑停机是否足够？如果平滑停机足够的话，那么如何结合 docker+k8s 进行热升级？

个人猜测了一下，这种场景下，后端服务应该会有冗余部署，前端通过负载均衡/elb/tgw 等中间层访问，或者使用 consul 之类的服务注册发现机制，串行重启或者分批次重启，来做到不停服升级服务

## 总结

热更新目标：

- 1、正在处理中的连接/服务/请求不能立即中断，需要继续提供服务
- 2、socket 对用户来说要保持可用，可以接受新的请求

直接沿用上篇的思路，热更新（单进程）流程，其基本流程如下：

- 1、用新的 bin 文件去替换老的 bin 文件
- 2、发送信号告知 server 进程（通常是 USR2 信号），进行平滑升级
- 3、server 进程收到信号后，通过调用 fork/exec 启动新的版本的进程
- 4、子进程调用接口获取从父进程继承的 socket 文件描述符重新监听 socket
- 5、老的进程不再接受请求，待正在处理中的请求处理完后，进程自动退出
- 6、子进程托管给 init 进程

## 参考

- https://grisha.org/blog/2014/06/03/graceful-restart-in-golang/
- https://blog.csdn.net/u012058778/article/details/78705536
- http://gulu-dev.com/post/2014-07-28-tech-evaluation
- https://golang.org/doc/go1.8#http_shutdown  golang1.8 升级日志，支持 gracefulshutdown

## 代码附录

#### 1、facebookgo/grace

```
// Command gracedemo implements a demo server showing how to gracefully
// terminate an HTTP server using grace.
package main

import (
	"flag"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/facebookgo/grace/gracehttp"
)

var (
	address0 = flag.String("a0", ":48567", "Zero address to bind to.")
	address1 = flag.String("a1", ":48568", "First address to bind to.")
	address2 = flag.String("a2", ":48569", "Second address to bind to.")
	now      = time.Now()
)

func main() {
	flag.Parse()
	gracehttp.Serve(
		&http.Server{Addr: *address0, Handler: newHandler("Zero  ")},
		&http.Server{Addr: *address1, Handler: newHandler("First ")},
		&http.Server{Addr: *address2, Handler: newHandler("Second")},
	)
}

func newHandler(name string) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/sleep/", func(w http.ResponseWriter, r *http.Request) {
		duration, err := time.ParseDuration(r.FormValue("duration"))
		if err != nil {
			http.Error(w, err.Error(), 400)
			return
		}
		time.Sleep(duration)
		fmt.Fprintf(
			w,
			"%s started at %s slept for %d nanoseconds from pid %d.\n",
			name,
			now,
			duration.Nanoseconds(),
			os.Getpid(),
		)
	})
	return mux
}
```

#### 2、fvbock/endless

```
package main

import (
	"log"
	"net/http"
	"os"

	"github.com/fvbock/endless"
	"github.com/gorilla/mux"
)

func handler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("WORLD!"))
}

func main() {
	mux1 := mux.NewRouter()
	mux1.HandleFunc("/hello", handler).
		Methods("GET")

	err := endless.ListenAndServe("localhost:4242", mux1)
	if err != nil {
		log.Println(err)
	}
	log.Println("Server on 4242 stopped")

	os.Exit(0)
}
```

#### 3、jpillora/overseer

```
package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/jpillora/overseer"
	"github.com/jpillora/overseer/fetcher"
)

//see example.sh for the use-case

// BuildID is compile-time variable
var BuildID = "0"

//convert your 'main()' into a 'prog(state)'
//'prog()' is run in a child process
func prog(state overseer.State) {
	fmt.Printf("app#%s (%s) listening...\n", BuildID, state.ID)
	http.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		d, _ := time.ParseDuration(r.URL.Query().Get("d"))
		time.Sleep(d)
		fmt.Fprintf(w, "app#%s (%s) says hello\n", BuildID, state.ID)
	}))
	http.Serve(state.Listener, nil)
	fmt.Printf("app#%s (%s) exiting...\n", BuildID, state.ID)
}

//then create another 'main' which runs the upgrades
//'main()' is run in the initial process
func main() {
	overseer.Run(overseer.Config{
		Program: prog,
		Address: ":5001",
		Fetcher: &fetcher.File{Path: "my_app_next"},
		Debug:   false, //display log of overseer actions
	})
}
```

#### 4、overseer

- overseer uses the main process to check for and install upgrades and a child process to run Program.

- The main process retrieves the files of the listeners described by Address/es.

- The child process is provided with these files which is converted into a Listener/s for the Program to consume.

- All child process pipes are connected back to the main process.

- All signals received on the main process are forwarded through to the child process.

- Fetcher runs in a goroutine and checks for updates at preconfigured interval. When Fetcher returns a valid binary stream (io.Reader), the master process saves it to a temporary location, verifies it, replaces the current binary and initiates a graceful restart.

- The fetcher.HTTP accepts a URL, it polls this URL with HEAD requests and until it detects a change. On change, we GET the URL and stream it back out to overseer. See also fetcher.S3.

- Once a binary is received, it is run with a simple echo token to confirm it is a overseer binary.

- Except for scheduled restarts, the active child process exiting will cause the main process to exit with the same code. So, overseer is not a process manager.

[外链图片转存失败，源站可能有防盗链机制，建议将图片保存下来直接上传 (img-nJwx0ZVC-1609089892264)(https://camo.githubusercontent.com/45df268c40025baddcafea70a437537c8c67b31c/68747470733a2f2f646f63732e676f6f676c652e636f6d2f64726177696e67732f642f316f31326e6a597952494c79335544733245364a7a794a456c3070735534655059694d5132306a6975564f592f7075623f773d35363626683d323834)]

## 参考

http://tengine.taobao.org/nginx_docs/cn/docs/control.html

## 附加技巧

> nginx 如何在指定时间内热重启？

> envoy 热重启流程跟一般golang进程、nginx进程又有什么异同？
