import Axios from "axios";

export class ExpenseTypeService {
     async getExpenseTypes(){
       return await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/expenses-types`).then(res =>{
         return res.data
       })
    }
}