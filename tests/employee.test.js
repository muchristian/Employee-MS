import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';
import * as employeeMockData from './mockdata/employee';
import * as authMockData from './mockdata/auth';
import statusCodes from '../src/utils/statusCodes';
import models from '../src/database/models';
import * as messages from '../src/utils/customMessages';
import fs from 'fs';

const { sequelize } = models;

chai.use(chaiHttp);
chai.should();

const { loginData1, signupData1 } = authMockData
const { employeeCreateData, employeeCreateData1, employeeUpdateData, employeeSuspendData, employeeActivateData } = employeeMockData;
const { badRequest, ok, created } = statusCodes;
const { employeeCreateSuccess, employeereturnSuccess, employeeItemsreturnSuccess, employeeUpdateSuccess, employeeDeleteSuccess } = messages
let employeeId;
let employeePosition;
let employeeName;
let employeePhoneNumber;
let employeeCode;
let resToken;
let confirmToken1;
describe('employee', () => {
    before( async () => {
        await sequelize.query('TRUNCATE TABLE employees');
    });

    describe('Authentication', () => {
        it('should signup', (done) => {
            chai
            .request(server)
            .post('/api/auth/signup')
            .send(signupData1)
            .end((err, res) => {
                console.log(err)
                const {token} = res.body
                confirmToken1 = token
                if (err) done(err);
                
                expect(res.status).to.equal(created);
                done();
            })
        })
        it("User should be able to confirm account", (done) => {
            chai
            .request(server)
            .get(`/api/auth/confirmation/${confirmToken1}`)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(ok);
                done();
            })
        })
        it('should login', (done) => {
            chai
            .request(server)
            .post('/api/auth/login')
            .send(loginData1)
            .end((err, res) => {
                if (err) done(err);
                const {token} = res.body
                resToken = `Bearer ${token}`
                expect(res.status).to.equal(ok);
                done();
            })
        })
    })
    describe('/POST employee item', () => {

        it('should POST post employee', (done) => {
            chai
            .request(server)
            .post('/api/employee/create')
            .set('Authorization', resToken)
            .send(employeeCreateData)
            .end((err, res) => {
                if (err) done(err);
                const {data} = res.body;
                employeeId = data.id
                expect(res.status).to.equal(created);
                done();
            })
        })

        it('should not allow to POST employee if is under 18', (done) => {
            chai
            .request(server)
            .post('/api/employee/create')
            .set('Authorization', resToken)
            .send(employeeCreateData1)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(statusCodes.conflict);
                done();
            })
        })
    });

    describe('/GET employee', () => {
        it('should GET all employee items', (done) => {
            chai
            .request(server)
            .get('/api/employee/')
            .set('Authorization', resToken)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(ok);
                done();
            })
        })

        it('should GET a employee item', (done) => {
            chai
            .request(server)
            .get(`/api/employee/${employeeId}`)
            .set('Authorization', resToken)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(ok);
                done();
            })
        })

        it("should be able to search with position, name and email", (done) => {
            chai
            .request(server)
            .get(`/api/employee/search?position=DEVELOPER&name=d&email=doe1`)
            .set('Authorization', resToken)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(ok);
                done();
            })
        })
        it("should be able to search with phoneNumber and code", (done) => {
            chai
            .request(server)
            .get(`/api/employee/search?&phoneNumber=+2507812&code=EMP`)
            .set('Authorization', resToken)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(ok);
                done();
            })
        })
    });

    describe('/PUT employee item', () => {
        it('should PUT a employee item', (done) => {
            chai
            .request(server)
            .put(`/api/employee/${employeeId}/edit`)
            .set('Authorization', resToken)
            .send(employeeUpdateData)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(ok);
                done();
            })
        })

        it('should be able to suspend employee', (done) => {
            chai
            .request(server)
            .patch(`/api/employee/${employeeId}/suspend`)
            .set('Authorization', resToken)
            .send(employeeSuspendData)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(ok);
                done();
            })
        })

        it('should be able to activate employee', (done) => {
            chai
            .request(server)
            .patch(`/api/employee/${employeeId}/activate`)
            .set('Authorization', resToken)
            .send(employeeActivateData)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(ok);
                done();
            })
        })
    });


    describe('/DELETE employee item', () => {
        it('should DELETE a employee item', (done) => {
            chai
            .request(server)
            .delete(`/api/employee/${employeeId}/delete`)
            .set('Authorization', resToken)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(ok);
                done();
            })
        })
    });

    describe('/POST upload excel data', () => {
        it('should POST uploaded excel data', (done) => {
            chai
            .request(server)
            .post('/api/employee/upload-data')
            .set('Authorization', resToken)
            .set('content-type', 'multipart/form-data')
            .attach('documents', fs.readFileSync(`${__dirname}/mockdata/mock_data.xlsx`), 'tests/mockdata/mock_data.xlsx')
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(created);
                done();
            })
        })
    })
})
