ENT-edt-RSS-Reader 0.0.1
========================

Tool to facilitate timetable access using ENT rss feed (actually transform the RSS feed into JSON).

Server
------
### Require
* NodeJS and modules

### How to install
* Download repository
* use npm install in the repository

Client
------
### Require
* Web Browser
* Valid RSS feed from ENT

Todo :
------
* Transform date into weekday
* Make display in table

```
createTimetable(datas)
	define number of days
		create cells
	for each day get it's position in week (create array ["monday, "tuesday",...]?)
		assign graphical position
```