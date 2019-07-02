import Axios from "axios";

export class PaymentTypeService {
     async getPaymentTypes(){
       console.log('default url:')
       console.log(process.env.REACT_APP_BACKEND_URL)
       return await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/payment-type`).then(res =>{
         return res.data
       })
    }
}