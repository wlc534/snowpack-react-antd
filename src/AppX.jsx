import React, { useState, useEffect } from 'react';
import { useRequest } from 'ahooks';
import ReactZmage from 'react-zmage';
import logo from './logo.svg';
import './App.css';
import styles from './App.module.css';
import {
  Button,
  Input,
  DatePicker,
  List,
  Space,
  Avatar,
  Row,
  Col,
  Select,
  Collapse,
  Tag,
  message,
  BackTop,
} from 'antd';
// import Button from 'antd/es/button';
// import Input from 'antd/es/input';
// import DatePicker from 'antd/es/date-picker';
// import List from 'antd/es/list';
// import Avatar from 'antd/es/avatar';
// import Row from 'antd/es/row';
// import Col from 'antd/es/col';
// import Select from 'antd/es/select';
// import Collapse from 'antd/es/collapse';
// import Tag from 'antd/es/tag';
// import message from 'antd/es/message';
import { BugOutlined, RedoOutlined } from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';

// import {Button} from 'antd';
// import 'antd/dist/antd.css';
const URL = `/api/v1/topics`;
const { default: Zmage } = ReactZmage;
const { Option } = Select;
const { Panel } = Collapse;
// console.log(Select);
// console.log('Input',Input)
// console.log('Button',Button)
// console.log('DatePicker',DatePicker)
// console.log('ReactZmage',ReactZmage)
// console.log('Zmage',Zmage)
// console.log('ReactEcharts',ReactEcharts)
const optionMap = {
  ask: { name: '问答', color: '#f50' },
  share: { name: '分享', color: '#2db7f5' },
  job: { name: '招聘', color: '#87d068' },
  good: { name: '精华', color: '#108ee9' },
  dev: { name: '测试', color: 'purple' },
};

function AppX() {
  const [tab, setTab] = useState('all');
  const {
    data: { data: dataSource = [] } = {},
    error,
    loading,
    run,
  } = useRequest(`${URL}?tab=${tab}`, {
    manual: true,
    onSuccess: (result, params) => {
      if (result.success) {
        message.success(`The username was changed to "${params[0]}" !`);
      }
    },
  });

  useEffect(() => {
    run();
  }, [tab]);

  const handleChange = (value) => {
    setTab(value);
  };
  return (
    <>
      <div className="App">
        <Row align="center">
          <Space>
            <Select value={tab} style={{ width: 120 }} onChange={handleChange}>
              <Option value="all">全部</Option>
              {Object.entries(optionMap).map(([key, value], index) => (
                <Option value={key} key={index}>
                  {value.name}
                </Option>
              ))}
            </Select>
            <Button type="primary" icon={<RedoOutlined />} onClick={run}>
              reload
            </Button>
          </Space>
        </Row>
        <List
          className={styles.appList}
          bordered
          loading={loading}
          itemLayout="horizontal"
          dataSource={dataSource}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={
                      // 'https://pic1.zhimg.com/v2-c5c95a5aa3ddf2e4ea1880295827af7c_im.jpg'
                      item?.author?.avatar_url
                    }
                  />
                }
                title={
                  <a href={`https://cnodejs.org/topic/${item.id}`}>
                    {item?.title}
                  </a>
                }
                description={
                  <Collapse>
                    <Panel
                      header={
                        <>
                          <span style={{ marginRight: 8 }}>文章类型:</span>
                          <Tag color={optionMap[item?.tab]?.color}>
                            {optionMap[item?.tab]?.name}
                          </Tag>
                          <span style={{ marginRight: 8 }}>回复量/访问量:</span>
                          <Tag>{`${item?.reply_count}/${item?.visit_count}`}</Tag>
                          <span style={{ marginRight: 8 }}>创建时间:</span>
                          <Tag>
                            {moment(item?.create_at).format(
                              'YYYY-MM-DD HH:mm:ss',
                            )}
                          </Tag>
                        </>
                      }
                    >
                      <div
                        className={styles.appContent}
                        dangerouslySetInnerHTML={{ __html: item?.content }}
                      />
                    </Panel>
                  </Collapse>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </>
  );
}

export default AppX;
