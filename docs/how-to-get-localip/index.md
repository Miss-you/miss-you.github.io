# 获取服务器本机 IP 的不同语言实现


## C/C++ 版本

```
int CNetOperations::GetLocalIp(__be32 *pLocalIp, const char* pIfName)
{
if (!pLocalIp || !pIfName)
{
return (-EINVAL);
}

int iSocket;
iSocket = socket(AF_INET, SOCK_DGRAM, 0);
if (iSocket < 0)
{
return (-errno);
}

struct ifreq stIfr;
memset(stIfr.ifr_name, 0x0, sizeof(stIfr.ifr_name));
strcpy(stIfr.ifr_name, pIfName);

int iRet;
iRet = ioctl(iSocket, SIOCGIFADDR, &stIfr);
if (iRet < 0)
{
close(iSocket);
return (-errno);
}

(*pLocalIp) = ((struct sockaddr_in *)&stIfr.ifr_addr)->sin_addr.s_addr;

close(iSocket);
return 0;
}
```

## golang 版本

## shell 版本

最初的想法

```

```

进一步改进

```
localip=`ip route get 1 | awk '{print $NF;exit}'`
```

局限性

## lua/Openresty 版本

依赖 luasocket 库的写法

```
xxx
```
原理

局限性

使用 ffi 调用的方式实现

```
xxx
```
原理

局限性


