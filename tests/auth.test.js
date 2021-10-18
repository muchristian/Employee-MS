import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';
import * as mockData from './mockdata/auth'; 
import statusCodes from '../src/utils/statusCodes';
import * as customMessages from '../src/utils/customMessages';
import models from '../src/database/models';

const { sequelize } = models;

chai.use(chaiHttp);
chai.should();

const { updateProfileData } = mockData;
const { ok, badRequest, conflict, unAuthorized, notFound, forbidden, created } = statusCodes;
const { userExist, userSignupSuccess, loginsuccess, loginfailed, resetIncorrectEmailError, resetsuccess, updatePasswordsuccess } = customMessages;

describe('authentication', () => {

let confirmToken;
let resetToken;
let resToken;
    describe('User signup', () => {
        before( async () => {
            await sequelize.query('TRUNCATE TABLE users');
        });
        it('should signup', (done) => {
            chai
            .request(server)
            .post('/api/auth/signup')
            .send(mockData.signupData)
            .end((err, res) => {
                const {token} = res.body
                confirmToken = token
                if (err) done(err);
                
                expect(res.status).to.equal(created);
                done();
            })
        })
        it('should not signup if email empty', (done) => {
            chai
            .request(server)
            .post('/api/auth/signup')
            .send(mockData.emailFieldEmpty)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(badRequest);
                done();
            })
        })

        it('should not signup if user exist', (done) => {
            chai
            .request(server)
            .post('/api/auth/signup')
            .send(mockData.signupData)
            .end((err, res) => {
                console.log(err)
                if (err) done(err);
                expect(res.status).to.equal(conflict);
                done();
            })
        })

    });

    describe('User Confirm', () => {
        it('If not confirmed should not be able to login in', (done) => {
            chai
            .request(server)
            .post('/api/auth/login')
            .send(mockData.loginData)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(unAuthorized);
                done();
            })
        })
        it("User should be able to confirm account", (done) => {
            chai
            .request(server)
            .get(`/api/auth/confirmation/${confirmToken}`)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(ok);
                done();
            })
        })
    })

    describe('User login', () => {
        it('should not login if one of the required request empty', (done) => {
            chai
            .request(server)
            .post('/api/auth/login')
            .send(mockData.loginFieldEmpty)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(badRequest);
                done();
            })
        })

        it('should not login if one of the request is incorrect', (done) => {
            chai
            .request(server)
            .post('/api/auth/login')
            .send(mockData.loginIncorrectCredentials)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(unAuthorized);
                done();
            })
        })

        it('should login', (done) => {
            chai
            .request(server)
            .post('/api/auth/login')
            .send(mockData.loginData)
            .end((err, res) => {
                if (err) done(err);
                const {token} = res.body
                resToken = `Bearer ${token}`
                expect(res.status).to.equal(ok);
                done();
            })
        })
    })

    describe('User reset password', () => {
        it('should not reset password if email is empty', (done) => {
            chai
            .request(server)
            .post('/api/auth/reset')
            .send(mockData.resetEmptyEmail)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(badRequest);
                done();
            })
        })

        it('should not reset password if email provided is incorrect', (done) => {
            chai
            .request(server)
            .post('/api/auth/reset')
            .send(mockData.resetIncorrectEmail)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(forbidden);
                done();
            })
        })

        it('should reset', (done) => {
            chai
            .request(server)
            .post('/api/auth/reset')
            .send(mockData.resetEmail)
            .end((err, res) => {
                if (err) done(err);
                const { token } = res.body;
                expect(res.status).to.equal(ok);
                resetToken = token
                done();
            })
        })
    })

    describe('User update password', () => {
        console.log(resetToken)
        it('should not update password if password and confirm password does not match', (done) => {
            chai
            .request(server)
            .put(`/api/auth/update-password/${resetToken}`)
            .send(mockData.notMatchPassword)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(badRequest);
                done();
            })
        })

        it('should update password', (done) => {
            chai
            .request(server)
            .put(`/api/auth/update-password/${resetToken}`)
            .send(mockData.updatePasswordData)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(ok);
                done();
            })
        })

        it('should update profile', (done) => {
            chai
            .request(server)
            .put(`/api/auth/update-profile`)
            .set('Authorization', resToken)
            .send(updateProfileData)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(ok);
                done();
            })
        })
    })

    describe("/GET logout", () => {
        it("should be able to logout", (done) => {
            chai
            .request(server)
            .get(`/api/auth/logout?token=${resToken.split(' ').pop()}`)
            .set('Authorization', resToken)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(ok);
                done();
            })
        })

        it('should not update if logged out', (done) => {
            chai
            .request(server)
            .put(`/api/auth/update-profile`)
            .set('Authorization', resToken)
            .send(updateProfileData)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(notFound);
                done();
            })
        })

        it('should not update if token not found', (done) => {
            chai
            .request(server)
            .put(`/api/auth/update-profile`)
            .set('Authorization', "")
            .send(updateProfileData)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(notFound);
                done();
            })
        })


        it('should not update if token is invalid', (done) => {
            chai
            .request(server)
            .put(`/api/auth/update-profile`)
            .set('Authorization', "fdada")
            .send(updateProfileData)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(unAuthorized);
                done();
            })
        })
    })
    
})
