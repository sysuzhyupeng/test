# -*- coding: utf-8 -*-
'''
Created on 2016��8��18��

@author: 10406
'''
#添加樓盤，前置条件为第一个橱窗没有物件。
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
import unittest, time, re
import random



class Rent1(unittest.TestCase):
    def setUp(self):

        self.driver = webdriver.Chrome()
        #設置隱式等待30秒
        self.driver.implicitly_wait(30)
        self.driver.get("https://www.8891.com.tw/user-signin.html")
        
    def test_rent_search(self):
        u"""橱窗添加楼盘回归测试"""
        driver = self.driver

        driver.find_element_by_xpath(".//*[@id='account']").clear()
        driver.find_element_by_xpath(".//*[@id='account']").send_keys("majia")
        driver.find_element_by_xpath(".//*[@id='password']").clear()
        driver.find_element_by_xpath(".//*[@id='password']").send_keys("a123456")
        driver.find_element_by_class_name("login-sb").click()
        time.sleep(2)
        # driver.find_element_by_xpath(".//*[@id='rent']/div[1]/div[1]/div/a[2]").click()#点击橱窗管理
        # driver.switch_to.frame("popbox_changerent_ifr")
        # driver.find_element_by_xpath("html/body/table/tbody/tr[1]/td[4]/p/a").click()#点击添加楼盘
        # time.sleep(2)
        # driver.switch_to.alert.accept()#接收弹窗警告
        # time.sleep(2)
        # print(u"添加后的物件=========")
        # b=driver.find_element_by_xpath(".//*[@id='rent']/div[1]/div[1]/div[1]/span[2]/strong").text
        print(u"登录成功")
    def tearDown(self):
        self.driver.quit()
        



if __name__ == "__main__":
    unittest.main()