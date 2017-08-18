# -*- coding: utf-8 -*-
'''
Created on 2016-08-18

@author: 10406
'''
# 下架橱窗中开启中的物件
#!/usr/bin/python

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
import unittest, time, re
import random




class Rent3(unittest.TestCase):
    def setUp(self):

        self.driver = webdriver.Chrome()
        #設置隱式等待30秒
        self.driver.implicitly_wait(30)
        self.driver.get("https://www.591.com.hk/home/user/login")
        
    def test_rent_search(self):
        u"""下架开启中的物件"""
        driver = self.driver
        
        driver.find_element_by_xpath(".//*[@id='userNameIput']").clear()
        driver.find_element_by_xpath(".//*[@id='userNameIput']").send_keys("0921223333")
        driver.find_element_by_xpath(".//*[@id='userRepwd']").clear()
        driver.find_element_by_xpath(".//*[@id='userRepwd']").send_keys("123456")
        driver.find_element_by_xpath(".//*[@id='btnSubmit']").click()
        time.sleep(2)
        driver.find_element_by_xpath(".//*[@id='rent']/div[1]/div[1]/div[2]/div[3]/button[1]").click()#点击橱窗管理
        driver.find_element_by_id("deal_modal").click()
        driver.switch_to.frame(driver.find_element_by_xpath(".//*[@id='deal_modal']/div/div/div[2]/iframe"))
        driver.find_element_by_xpath(".//*[@id='nofill']").click()
        driver.find_element_by_xpath(".//*[@id='deal_btn']").click()
    def tearDown(self):
        self.driver.quit()
        



if __name__ == "__main__":
    unittest.main()