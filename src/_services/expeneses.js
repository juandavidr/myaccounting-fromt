import Axios from "axios";

export class ExpenseService {
     async getExpenses(){
       return await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/expenses`).then(res =>{
         return res.data
       })
    }
}