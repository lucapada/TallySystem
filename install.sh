#!/bin/bash
sudo apt-get install nodejs &&
cd ~/ && 
git clone https://github.com/lucapada/TallySystem.git && 
git clone -b develop https://gitee.com/ossrs/srs.git && 
cd srs/trunk && ./configure && make && ./objs/srs -c conf/rtmp2rtc.conf