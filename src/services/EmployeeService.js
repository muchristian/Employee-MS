import models from '../database/models';
import QueriesClass from './queriesClass';


const { employee } = models;

class EmployeeService extends QueriesClass {
 constructor() {
     super();
     this.model = employee
 }
}

export default new EmployeeService();