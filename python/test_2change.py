# -*- coding: utf-8 -*-
'''
Created on 2016-08-18

@author: 10406
'''

# 出租櫥窗換盤，前置条件为账号内有一笔开启中的物件。
#!/usr/bin/python

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
import unittest, time, re
import random



class Rent2(unittest.TestCase):
    def setUp(self):

        self.driver = webdriver.Chrome()
        #設置隱式等待30秒
        self.driver.implicitly_wait(30)
        self.driver.get("https://www.591.com.hk/home/user/login")
        
    def test_rent_search(self):
        u"""橱窗换盘回归测试"""
        driver = self.driver
        

        driver.maximize_window()
        driver.find_element_by_xpath(".//*[@id='userNameIput']").clear()
        driver.find_element_by_xpath(".//*[@id='userNameIput']").send_keys("0921223333")
        driver.find_element_by_xpath(".//*[@id='userRepwd']").clear()
        driver.find_element_by_xpath(".//*[@id='userRepwd']").send_keys("123456")
        driver.find_element_by_xpath(".//*[@id='btnSubmit']").click()
   
        time.sleep(2)

        nowhandle=driver.current_window_handle
        print(u'物件標題==========')
        a= driver.find_element_by_xpath(".//*[@id='rent']/div[1]/div[1]/div[1]").text#物件地址及金额
        print(a)
        driver.find_element_by_xpath(".//*[@id='rent']/div[1]/div[1]/div[2]/div[2]/button[1]").click()#点击更换楼盘
        driver.switch_to.frame("popbox_changerent_ifr")
        driver.find_element_by_xpath("html/body/table/tbody/tr[1]/td[4]/p/a").click()#选择更换物件
        driver.find_element_by_xpath(".//*[@id='popbox_qs']/div/div[1]/p/button[2]").click()#下架物件


        print(u'更換后物件標題==========')
        b= driver.find_element_by_xpath(".//*[@id='rent']/div[1]/div[1]/div[1]").text#打印更换后物件地址及金额
        print(b)

    def tearDown(self):
        self.driver.quit()
        
        #self.assertEqual([], self.verificationErrors)


if __name__ == "__main__":
     unittest.main()