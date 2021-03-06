# Go 语言：解决数据库中 null 值的问题


> 本文主要介绍如何使用 go 语言 database/sql 库从数据库中读取 null 值的问题，以及如何向数据库中插入 null 值。本文在这里使用的是 sql.NullString, sql.NullInt64, sql.NullFloat64 等结构体，为了方便书写，它们的泛指我会使用 sql.Null 来表示

## 要点

1. 从数据库读取可能为 null 值得值时，可以选择使用 sql.NULL 来读取；或者使用 IFNULL、COALESCE 等命令让数据库查询值返回不为""或者 NULL
2. 若需要往数据库中插入 null 值，则依然可以使用 sql.NULL 存储所需的值，然后进行插入 NULL 值
3. 直接使用 sql.NULL 类型容易出现 valid 遗漏设置等问题，普通 int、string 与其转换时，请写几个简单的 get、set 函数

**本 demo 使用的数据库表以及数据如下**

```
mysql> desc person;
+------------+--------------+------+-----+---------+----------------+
| Field      | Type         | Null | Key | Default | Extra          |
+------------+--------------+------+-----+---------+----------------+
| id         | int(11)      | NO   | PRI | NULL    | auto_increment |
| first_name | varchar(100) | NO   |     | NULL    |                |
| last_name  | varchar(40)  | YES  |     | NULL    |                |
| age        | int(11)      | YES  |     | NULL    |                |
+------------+--------------+------+-----+---------+----------------+

mysql> select * from person;
+----+------------+-----------+------+
| id | first_name | last_name | age  |
+----+------------+-----------+------+
|  1 | yousa      | NULL      | NULL |
+----+------------+-----------+------+

mysql> show create table person;
+--------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Table  | Create Table                                                                                                                                                                                                                                           |
+--------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| person | CREATE TABLE `person` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(40) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 |
+--------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
1 row in set (0.00 sec)

```

## 从数据库中读取 NULL 值

如果不作处理直接从数据库中读取 NULL 值到 string/int，会发生如下错误错误

```
Scan NULL 值到 string 的报错
sql: Scan error on column index 1: unsupported Scan, storing driver.Value type <nil> into type *string

Scan NULL 值到 int 的报错
sql: Scan error on column index 1: converting driver.Value type <nil> ("<nil>") to a int: invalid syntax

```

使用如下的 struct 来读取数据库内容

```

type Person struct {
	firstName 				string
	lastName 				string 
	age						int
}

	//由于只有一行，直接使用 QueryRow
	row := db.QueryRow("SELECT first_name, last_name FROM person WHERE first_name='yousa'")
	err = row.Scan(&hello.firstName, &hello.lastName)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(hello)

	row1 := db.QueryRow("SELECT first_name, age FROM person WHERE first_name='yousa'")
	err = row1.Scan(&hello.firstName, &hello.age)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(hello)
```

运行代码，可以通过日志看出来，错误来自 Scan 将 NULL 值赋值给 int 或者 string 时，报错；解决这个问题可以使用 sql 原生结构体 sql.Null 来解决

### 使用 sqlNull

sql.Null 在 sql 库中声明如下，在读取时，（比如读取的值存储到 NullInt64），假如发现存储的值是 NULL，则会将 NullInt64 的 valid 设置为 false，然后不会将值存储到 Int64 中，Int64 值默认为 0，如果是 NullString 则 String 值时 nil；如果是正常值，则会将 Valid 赋值为 true，将值存储到 Int64 中。

```
type NullInt64 struct {
    Int64 int64
    Valid bool // Valid is true if Int64 is not NULL
}
func (n *NullInt64) Scan(value interface{}) error
func (n NullInt64) Value() (driver.Value, error)

type NullString struct {
    String string
    Valid  bool // Valid is true if String is not NULL
}
func (ns *NullString) Scan(value interface{}) error
func (ns NullString) Value() (driver.Value, error)
```

代码修改为如下：

```
type Person struct {
	firstName 				string
	lastNullName 			sql.NullString
	nullAge 				sql.NullInt64
}

	rowNull := db.QueryRow("SELECT first_name, last_name FROM person WHERE first_name='yousa'")
	err = rowNull.Scan(&hello.firstName, &hello.lastNullName)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(hello)

	rowNull1 := db.QueryRow("SELECT first_name, age FROM person WHERE first_name='yousa'")
	err = rowNull1.Scan(&hello.firstName, &hello.nullAge)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(hello)

```

输出结果

```
{yousa  0 { false} {0 false}}
```

### 使用 IFNULL 或者 COALESCE

coalesce() 解释：返回参数中的第一个非空表达式（从左向右依次类推）

IFNULL(expr1,expr2): 如果 expr1 不是 NULL，IFNULL() 返回 expr1，否则它返回 expr2。IFNULL() 返回一个数字或字符串值，取决于它被使用的上下文环境。

查询语句使用一个默认值来替换 NULL 即可

```
SELECT first_name, COALESCE(age, 0) FROM person;//
SELECT first_name, IFNULL(age, 0) FROM person;//
```

## 往数据库中插入 NULL 值

前面我们对 SELECT 语句使用了 sql.Null 类型，同理，INSERT、UPDATE 语句也可以通过使用这种类型来插入 nil 值

代码如下：

```
	hello := Person {
		firstName: "",
		lastName: "",
		age: 0,
		lastNullName: sql.NullString{String:"", Valid:false},
		nullAge: sql.NullInt64{Int64:0, Valid:false}}
	_, err = db.Exec(
		"INSERT INTO person (first_name, last_name) VALUES (?, ?)", "yousa1", hello.lastName)
	if err != nil {
		fmt.Println(err)
	}

	_, err = db.Exec(
		"INSERT INTO person (first_name, last_name) VALUES (?, ?)", "yousa2", hello.lastNullName)
	if err != nil {
		fmt.Println(err)
	}

//数据库插入结果
mysql> select * from person;
+----+------------+-----------+------+
| id | first_name | last_name | age  |
+----+------------+-----------+------+
|  1 | yousa      | NULL      | NULL |
|  2 | yousa1     |           | NULL |
|  3 | yousa2     | NULL      | NULL |
+----+------------+-----------+------+
```

解释下 db.Exec 操作 hello.lastNullName 的过程：

首先它会调用 hello.lastNullName 的 Value 方法，获取到 driver.Value，然后检验 Valid 值是 true 还是 false，如果是 false 则会返回一个 nil 值（nil 值传给 sql driver 会被认为是 NULL 值），如果是 true 则会将 hello.lastNullName.String 的值传过去。

PS: 为了保证你所插入的值能如你所期望是 NULL 值，一定记得要将 sql.Null 中 Valid 值置为 false

**使用 NULL 还是有很多危害的，再回顾下数据库中使用 NULL 值的危害**

### 为什么不建议使用 NULL

1. 所有使用 NULL 值的情况，都可以通过一个有意义的值的表示，这样有利于代码的可读性和可维护性，并能从约束上增强业务数据的规范性。
2. NULL 值在 timestamp 类型下容易出问题，特别是没有启用参数 explicit_defaults_for_timestamp
3. NOT IN、!= 等负向条件查询在有 NULL 值的情况下返回永远为空结果，查询容易出错
4. Null 列需要更多的存储空间：需要一个额外字节作为判断是否为 NULL 的标志位
4. NULL 值到非 NULL 的更新无法做到原地更新，更容易发生索引分裂，从而影响性能。

PS：**但把 NULL 列改为 NOT NULL 带来的性能提示很小，除非确定它带来了问题，否则不要把它当成优先的优化措施，最重要的是使用的列的类型的适当性。**

当然有些情况是不得不使用 NULL 值进行存储，或者在查询时由于 left/right join 等导致 NULL 值，但总体来说，能少用就少用。

## helper func（提升效率/减少错误）

如果使用 sql.NULL 的话，由于其有两个字段，如果直接手动赋值的话还是很容易遗漏，所以还是需要简单的转换函数，这里给了两个简单的 helper fuc，分别是将 int64 转换成 NullInt64 和将 string 转换成 NullString

```
//ToNullString invalidates a sql.NullString if empty, validates if not empty
func ToNullString(s string) sql.NullString {
	return sql.NullString{String : s, Valid : s != ""}
}

//ToNullInt64 validates a sql.NullInt64 if incoming string evaluates to an integer, invalidates if it does not
func ToNullInt64(s string) sql.NullInt64 {
	i, err := strconv.Atoi(s)
	return sql.NullInt64{Int64 : int64(i), Valid : err == nil}
}
```
  
 
## 参考博客
 
- https://github.com/go-sql-driver/mysql/issues/34
- https://github.com/guregu/null
- https://gocn.io/question/243
- https://godoc.org/database/sql
- http://url.cn/5cFTz4W  一千个不用 Null 的理由

