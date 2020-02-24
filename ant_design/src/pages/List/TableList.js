import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Link from 'umi/link';
// import { DatePicker } from 'antd';
// const { RangePicker } = DatePicker;
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TableList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = [];
const status = [];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      fieldsValue.createTime = fieldsValue.createTime.format('YYYY-MM-DD');
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新建用户"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Row>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Avatar">
        {form.getFieldDecorator('avatar')(<Input placeholder="请输入" />)}
      </FormItem>
      </Row>
      <Row>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="other">
        {form.getFieldDecorator('other')(<Input placeholder="请输入" />)}
      </FormItem>
      </Row>
      <Row>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Name">
        {form.getFieldDecorator('name')(<Input placeholder="请输入" />)}
      </FormItem>
      </Row>
      <Row>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Age">
        {form.getFieldDecorator('age')(<Input placeholder="请输入" />)}
      </FormItem>
      </Row>
      <Row>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Gender">
        {form.getFieldDecorator('isMale')(<Input placeholder="请输入" />)}
      </FormItem>
      </Row>
      <Row>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Phone">
        {form.getFieldDecorator('phone')(<Input placeholder="请输入" />)}
      </FormItem>
      </Row>
      <Row>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Email">
        {form.getFieldDecorator('email')(<Input placeholder="请输入" />)}
      </FormItem>
      </Row>
      <Row>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Address">
        {form.getFieldDecorator('address')(<Input placeholder="请输入" />)}
      </FormItem>
      </Row>
      <Row>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="CreateTime">
        {form.getFieldDecorator('createTime')
        ( <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="请输入创建日期" />)}
      </FormItem>
      </Row>
    </Modal>
  );
});

@Form.create()

/* eslint react/no-multi-comp:0 */
@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
  
      // render: text => <Link to={`/profile/basic/${text.replace(/\s+/gi, '-')}`}>{text}</Link>,
    },
    {
      title:'other',
      dataIndex:'other',
    },
    {
      title:'Name',
      dataIndex:'name',
      },
    
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Gender',
        dataIndex: 'isMale',
        key: 'isMale',
        render: text => <span>{text ? 'Male' : 'Female'}</span>,
    },
    {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'CreateTime',
        dataIndex: 'createTime',
        key: 'createTime',
        },
    
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };



  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue);

      if(fieldsValue.createTime!=undefined)
        fieldsValue.createTime = fieldsValue.createTime.format('YYYY-MM-DD');
      // console.log(fieldsValue.createTime);
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      // console.log(values)

      this.setState({
        formValues: values,
      });
     
      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };



  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/add',
      payload: {
        data: fields,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };


  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={12} >
            <FormItem label="Name">
          {getFieldDecorator('name')(<Input placeholder="请输入"   />)}
            </FormItem>
          </Col>
          <Col md={4} sm={12}>
            <FormItem label="Address">
              {getFieldDecorator('address')(
                <Select placeholder="请选择" >
                  <Option value="北京">北京</Option>
                  <Option value="天津">天津</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          {/*<Col md={8} sm={24}>
          <span style={{marginRight:8}}>Createtime</span>
          <span>
              <DatePicker
                      style={{width:250}}
                      showTime={{ format: 'HH:mm' }}
                      format="YYYY-MM-DD HH:mm"
                      placeholder={['Start Date', 'End Date']}
                       //onChange={onChange}
                      // onOk={onOk}
                    />

          </span>
            </Col>*/}
             <Col md={8} sm={24}>
            <FormItem label="CreateTime">
              {getFieldDecorator('createTime')(
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="请输入创建日期" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              

              {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
               展开 <Icon type="down" />
            </a>*/ }
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

 
  renderForm() {
    const { expandForm } = this.state;
  
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    
  }

  render() {
    const {
      rule: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, stepFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        {/* <Menu.Item key="approval">批量审批</Menu.Item> */}
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderWrapper title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />

      </PageHeaderWrapper>
    );
  }
}

export default TableList;
