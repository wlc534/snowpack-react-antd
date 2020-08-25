import React, {
  useState,
  useEffect,
} from 'react';
import {
  Button,
  Table,
  Divider,
  Modal,
  Row,
  Col,
  Input,
  Select,
  Switch,
  DatePicker,
  message,
  Popconfirm,
  Form,
} from 'antd';
import { useRequest, useAntdTable } from 'ahooks';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';


const baseUrl = '';
/**
 * 数据请求API地址URL
 */
const queryAllOptionUrl = `${baseUrl}/namelist/queryAll`; //获取所有名单列表
const queryTableDataUrl = `${baseUrl}/namelistdata/query`; //询名单列表数据
const deleteOneTableDataUrl = `${baseUrl}/namelistdata/delete`; //询名单列表数据
const addOneTableDataUrl = `${baseUrl}/namelistdata/add`; //新增名单列表数据
const updateOneTableDataUrl = `${baseUrl}/namelistdata/update`; //更新名单列表数据

const { TextArea } = Input;
const { Option } = Select;

const formStyleObj = {
  background: '#fbfbfb',
  border: '1px solid #d9d9d9',
  borderRadius: 6,
  marginBottom: 20,
};
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};
const modalFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const tailFormItemLayout = {
  wrapperCol: {
    span: 16,
    offset: 6,
  },
};

  /**
   * 新增、修改 模态框中Form
   */

const CollectionCreateForm = (props) => {
  const [form] = Form.useForm();
  const {
    visible,
    initialValues,
    confirmLoading,
    onCancel,
    onCreate,
    optionListForfarther,
    modalTitle,
    addModeFlag,
  } = props;


  useEffect(() => {
    if (visible) {
      form.setFieldsValue(initialValues);
    }
  }, [visible]);

  return (
    <Modal
      forceRender
      visible={visible}
      title={modalTitle}
      confirmLoading={confirmLoading}
      okText="确定"
      cancelText="取消"
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onCreate(values);
            form.resetFields();
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        {...modalFormItemLayout}
        form={form}
        name="collection_create_form"
      >
        <Form.Item
          label="名单ID"
          name="id"
          style={addModeFlag&&{ display:'none' }}
        >
          <Input placeholder="请输入名单数据" disabled />
        </Form.Item>
        <Form.Item
          label="所属名单集"
          name="listId"
          rules={[
            {
              required: true,
              message: '请选择名单数据',
            },
          ]}
        >
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {optionListForfarther.map(({ id, name }, index) => (
              <Option key={index} value={id}>
                {name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="名单数据"
          name="data"
          rules={[
            {
              required: true,
              message: '请输入名单数据',
            },
          ]}
        >
          <Input placeholder="请输入名单数据" />
        </Form.Item>
        <Form.Item
          label="描述"
          name="remark"
          rules={[
            {
              required: true,
              message: '请输入描述内容',
            },
          ]}
        >
          <TextArea
            placeholder="请输入描述内容"
            autosize={{ minRows: 2, maxRows: 6 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const getTableDataService = ({ current, pageSize }, formData) => {
  let query = `${queryTableDataUrl}?current=${current}&pageSize=${pageSize}`;
  Object.entries(formData).forEach(([key, value]) => {
    if (value) {
      query += `&${key}=${value}`;
    }
  });
  return query;
};

function objToQueryParams(formData) {
  let query = ``;
  Object.entries(formData).forEach(([key, value]) => {
    if (value) {
      query += `&${key}=${value}`;
    }
  });
  return query;
}

function objToFormData(obj) {
  const dataToEnd = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    if (value) {
      dataToEnd.append(key, value);
    }
  });
  return dataToEnd;
}

const SearchFormTable = (props) => {
  const [form] = Form.useForm();
  const [initialValues,setInitialValues]=useState({});
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [addModeFlag, setAddModeFlag] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [dataSource, setDataSource] = useState([
    { 
      data: '郝海东',
      gmtCreate: 1596095923000,
      gmtModify: 1596095923000,
      id: 812,
      listId: 1,
      remark: '郝海东',
    },
    {
      data: '朴有天',
      gmtCreate: 1568025778000,
      gmtModify: 1596092950000,
      id: 811,
      listId: 1,
      remark: ' 朴有天',
    },
    {
      data: '毕福剑',
      gmtCreate: 1568025778000,
      gmtModify: 1568025830000,
      id: 801,
      listId: 1,
      remark: ' ',
    },
  ]);
  const {
    data: {
      attr: optionList = [
        {
          gmtCreate: 1565943145000,
          gmtModify: 1567652155000,
          id: 1,
          name: '负面明星',
          remark: '负面明星',
        },
        {
          gmtCreate: 1565943171000,
          gmtModify: 1596095936000,
          id: 11,
          name: '测试',
          remark: '说明',
        },
      ],
    } = {},
  } = useRequest(queryAllOptionUrl);

  /**
   * 基于初始化数据请求Table数据（查询）
   */
  const { tableProps, search, loading, run: queryTableDataRun } = useAntdTable(
    getTableDataService,
    {
      onSuccess: (result) => {
        //格式化后数据的返回
        setDataSource(result.list);
      },
      formatResult: (res) => {
        //返回数据格式映射
        return {
          list: res.attr.dataList,
          total: res.attr.total,
        };
      },
      defaultPageSize: 10,
      // defaultParams: [   //设置初始化值，defaultParams 是一个数组，第一个值为分页相关参数，第二个值为表单相关数据。如果有第二个值，会自动初始化表单
      //   { current: 1, pageSize: 10 },
      //   { data:'张元' },
      // ],
      form,
    },
  );
  const { type, changeType, submit, reset } = search;
  const { dataSource: ds, ...tablePropsRest } = tableProps; //用于操作行内数据模式，普通模式无需解构

  /**
   * 基于Id（唯一标识）删除指定数据，成功后请求Table数据（删除）
   */
  const { run: deleteOneTableDataRun } = useRequest(
    ({ id }) => `${deleteOneTableDataUrl}?id=${id}`,
    {
      manual: true,
      onSuccess: (result) => {
        console.log('result', result);
        if (result.success) {
          message.success('删除成功');
          submit();
        } else {
          message.error('删除失败');
        }
      },
    },
  );

  /**
   * 新建一条数据，成功后请求Table数据（新增）
   */
  const { run: addOneTableDataRun } = useRequest(
    (formData) => ({
      url: `${addOneTableDataUrl}`,
      method: 'post',
      body: formData,
    }),
    {
      manual: true,
      onSuccess: (result) => {
        console.log('result', result);
        if (result.success) {
          message.success('新增成功');
          submit();
        } else {
          message.error('新增失败');
        }
      },
    },
  );

  /**
   * 基于Id（唯一标识）更新指定数据，成功后请求Table数据（更新）
   */
  const { run: updateOneTableDataRun } = useRequest(
    (formData) => ({
      url: `${updateOneTableDataUrl}`,
      method: 'post',
      body: formData,
    }),
    {
      manual: true,
      onSuccess: (result) => {
        console.log('result', result);
        if (result.success) {
          message.success('修改成功');
          submit();
        } else {
          message.error('修改失败');
        }
      },
    },
  );

  /**
   * 获取SearchFormTable组件中Form的数据，如有表单联动等，====>使用 setFieldsValue<======
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  /**
   * 删除处理函数
   */
  function deleteOneTableDataFn(record) {
    deleteOneTableDataRun({ id: record.id });
  }

  /**
   * 新增处理函数
   */
  function addOneTableDataFn(record) {
    addOneTableDataRun(objToFormData(record));
  }

  /**
   * 更新处理函数
   */
  function updateOneTableDataFn(record) {
    updateOneTableDataRun(objToFormData(record));
  }

  /**
   * 模态框出现，进入新增模式
   */
  function enterAddMode() {
    setVisible(true);
    setAddModeFlag(true);
    setModalTitle('新建名单数据');
    setInitialValues({});
  }

  /**
   * 模态框出现，进入编辑模式
   */
  function enterUpdateMode(record) {
    setVisible(true);
    setAddModeFlag(false);
    setModalTitle('编辑名单数据');
    /**
     * Table 一条数据回填到子组件CollectionCreateForm中的Form，用于再次编辑，也可通过props传入
     * 使用 setFieldsValue 来动态设置控件的值,表单联动、表单数据来自后端等都需要用到setFieldsValue
     */
    setInitialValues(record);
   
  }

  /**
   * 模态框关闭函数
   */
  function handleCancel() {
    setVisible(false);
  }

  /**
   * 获取Form表单数据、提交数据（新增和更新）、成功后模态框关闭
   */
  function handleCreate(values) {

    if (addModeFlag) {
      addOneTableDataFn(values);
    } else {
      updateOneTableDataFn(values);
    }
    setConfirmLoading(false);
    setVisible(false);
    // form.validateFields((err, values) => {
    //   if (err) {
    //     setConfirmLoading(false);
    //     return;
    //   }

    //   form.resetFields();

    //   setVisible(false);
    // });
  }

  /**
   * 包含Form检验的,成功后submit
   */
  function handleSubmitAndQuery() {
    // const { form } = saveFormRef.current;
    // form.validateFields((err, values) => {
    //   console.log(err)
    //   if (err) {
    //     return;
    //   }
    //   submit();
    // });
  }

  /**
   * 基于获取到的数据进行inline更新修改（常用情形：行内某字段状态切换、行内部分内容编辑、批量操作等）
   * */
  function updateOneTableDataInline(value, index) {
    const tempList = [...dataSource];
    tempList.splice(index, 1, { ...tempList[index], remark: value });
    setDataSource(tempList);
  }

  /**
   * Table 列信息、字段映射、操作等
   * */
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '名单数据', dataIndex: 'data', key: 'data' },
    { title: '描述', dataIndex: 'remark', key: 'remark' },
    {
      title: '修改时间',
      dataIndex: 'gmtModify',
      key: 'gmtModify',
      render: (text, record) => (
        <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render: (text, record) => {
        return (
          <span>
            {/*图标版*/}
            <EditOutlined
              title="修改"
              onClick={() => enterUpdateMode(record)}
            />
            {/*文字版*/}
            {/*<a onClick={()=>enterUpdateMode(record)}>修改</a>*/}
            <Divider type="vertical" />
            <Popconfirm
              title="确定要删除?"
              onConfirm={() => deleteOneTableDataFn(record)}
              okText="确定"
              cancelText="取消"
            >
              <DeleteOutlined title="删除" />
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  /**
   * 高级表单
   * */
  const advanceSearchForm = (
    <div>
     <Form form={form} name="advance-search-form-table" {...formItemLayout}>
        <Row gutter={24} style={{ marginTop: 20 }}>
          <Col span={8}>
            <Form.Item label="名单集" name="listId" initialValue="">
              <Select
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {optionList.map(({ id, name }, index) => (
                  <Option key={index} value={id}>
                    {name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="名单数据" name="data">
              <Input placeholder="请输入名单数据" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" onClick={submit}>
                查询
              </Button>
              <Button onClick={reset} style={{ marginLeft: 16 }}>
                重置
              </Button>
              {/*<Button type="link" onClick={changeType}>*/}
              {/*  Simple Search*/}
              {/*</Button>*/}
              {/*<Button type="primary" htmlType="submit" >*/}
              {/*  测试submit*/}
              {/*</Button>*/}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );

  /**
   * 普通表单
   * */
  const searchForm = (
    <div style={formStyleObj}>
      <Form form={form} name="search-form-table" {...formItemLayout}>
        <Row gutter={24} style={{ marginTop: 20 }}>
          <Col span={8}>
            <Form.Item label="名单集" name="listId" initialValue="">
              <Select
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {optionList.map(({ id, name }, index) => (
                  <Option key={index} value={id}>
                    {name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="名单数据" name="data">
              <Input placeholder="请输入名单数据" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" onClick={submit}>
                查询
              </Button>
              <Button onClick={reset} style={{ marginLeft: 16 }}>
                重置
              </Button>
              {/*<Button type="link" onClick={changeType}>*/}
              {/*  Simple Search*/}
              {/*</Button>*/}
              {/*<Button type="primary" htmlType="submit" >*/}
              {/*  测试submit*/}
              {/*</Button>*/}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
 
  return (
    <div className="pageContent" style={{ height: 'auto' }}>
      {type === 'simple' ? searchForm : advanceSearchForm}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" onClick={enterAddMode}>
          +新增
        </Button>
      </div>
      {/*普通模式*/}
      {/*<Table columns={columns}  {...tableProps} />*/}
      {/*操作行数据模式或者请求成功需要对数据加工场景,对于dataSource默认将每列数据的key属性作为唯一的标识，
      如果 dataSource[i].key 没有提供，你应该使用 rowKey 来指定 dataSource 的主键，
       比如你的数据主键是 uid，手动指定 <Table rowKey="uid" />或者<Table rowKey={record => record.uid} />;
      */}
      <Table rowKey='id' columns={columns} {...tablePropsRest} dataSource={dataSource} /> 
      <CollectionCreateForm
        modalTitle={modalTitle}
        visible={visible}
        initialValues={initialValues}
        addModeFlag={addModeFlag}
        confirmLoading={confirmLoading}
        optionListForfarther={optionList}
        onCancel={handleCancel}
        onCreate={handleCreate}
      />
    </div>
  );
};
export default SearchFormTable;
