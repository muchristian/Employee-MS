import models from '../database/models';
import QueriesClass from './queriesClass';


const { user } = models;

class UserService extends QueriesClass {
 constructor() {
     super();
     this.model = user
 }
}

export default new UserService();
