import { parse } from 'url';

// mock tableListDataSource
let tableListDataSource = [];

tableListDataSource.push({
    key:'tom',
    avatar:'img',
    other:'2',
    name:'tom',
    age:'82',
    Gender:'male',
    phone:'123456',
    email:'asdf',
    address:'北京',
    createTime: '2019-01-01',
});
tableListDataSource.push({
    key:'zsw',
    avatar:'img1',
    other:'22',
    name:'zsw',
    age:'82',
    Gender:'male',
    phone:'123456',
    email:'asdf',
    address:'天津',
    createTime:'2019-01-02',});
function getRule(req, res, u) {
    let url = u;
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
        url = req.url; // eslint-disable-line
    }

    const params = parse(url, true).query;

    let dataSource = tableListDataSource;

   

    if (params.status) {
        const status = params.status.split(',');
        let filterDataSource = [];
        status.forEach(s => {
            filterDataSource = filterDataSource.concat(
              dataSource.filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
            );
        });
        dataSource = filterDataSource;
    }

    if (params.name) {
        dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
    }
    if (params.address) {

        dataSource = dataSource.filter(data => data.address.indexOf(params.address) > -1);
    }
    if (params.createTime) {

        dataSource = dataSource.filter(data => data.createTime.indexOf(params.createTime) > -1);
    }
    let pageSize = 10;
    if (params.pageSize) {
        pageSize = params.pageSize * 1;
    }

    const result = {
        list: dataSource,
        pagination: {
            total: dataSource.length,
            pageSize,
                current: parseInt(params.currentPage, 10) || 1,
        },
    };

    return res.json(result);
}

function postRule(req, res, u, b) {
    let url = u;
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
        url = req.url; // eslint-disable-line
    }

    const body = (b && b.body) || req.body;


    switch (body.method) {
        /* eslint no-case-declarations:0 */
        case 'delete':
            const {key ,name}=body;
            tableListDataSource = tableListDataSource.filter(item => key.indexOf(item.key) === -1);
            break;
        case 'post':
            // const i = Math.ceil(Math.random() * 10000);
            tableListDataSource.unshift({
                
                key:body.data.name,
                avatar:body.data.avatar,
                other:body.data.other,
                name:body.data.name,
                age:body.data.age,
                Gender:body.data.isMale,
                phone:body.data.phone,
                email:body.data.email,
                address:body.data.address,
                createTime: body.data.createTime,
            });
            console.log(tableListDataSource);
            break;
       
        default:
            break;
    }

    return getRule(req, res, u);
}

export default {
  'GET /api/rule': getRule,
  'POST /api/rule': postRule,
  };
