import React,{useState,useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/App.css';
import { ReactSession }  from 'react-client-session';
import { Button } from 'react-bootstrap';
//import cartEmpty from '../images/cartEmpty.png';

const Cart=()=>{
    
    const [cart,setCarts]=useState([]);
    
    

    useEffect(()=>{
        setCarts(ReactSession.get("cart"));

    },[setCarts])

    function deleteItem(index){
        var newcart=cart.filter((item,i) => i !== index);
        setCarts(newcart);
        ReactSession.set("cart",newcart);
    }

    function deleteCart(){
        setCarts([]);
        sessionStorage.removeItem("cart");
        ReactSession.set("cart",[]);
    }

    function TotalLabel(){
        var totals=0;
        cart.forEach(item=>totals+=item.itemCount*item.itemPrice);
        //setTotal(totals);
        return(<>
            <label className='price'>目前總共{totals}元</label>
            </>
        )
    }


    function editCount(rowIndex){
        var btn=document.getElementById("changeBtn"+rowIndex);
        var rowId="row"+rowIndex;
        var labelId="itemLabel"+rowIndex;
        var row=document.getElementById(rowId);
        var label=document.getElementById(labelId);

        /*
        var othersLabel=document.querySelectorAll('.hidden');
        var othersRow=document.querySelectorAll('.display');
        var othersChangeBtn=document.querySelector('.changeBtn');

        othersLabel.forEach(element=>element.classList.remove('hidden'));
        othersRow.forEach(element=>element.classList.remove('.display'));
        //othersChangeBtn.forEach(element=>element.innerHTML='變更');
        */

        /* 將原有數量標籤先隱藏 如果二次點擊則恢復*/
        /* 接下來將input顯示出來*/
        if(!row.classList.contains("display")){
            row.classList.add("display");
            label.classList.add("hidden");
            btn.innerHTML="取消";
        }
        else{
            row.classList.remove("display");
            label.classList.remove("hidden");
            btn.innerHTML="變更";
        }
        /*如果其他按鈕有正在編輯數量，則取消其操作 */
        

        
    }
    
    const editEnter=(event,i)=>{//enter觸發事件，如果值大於0才可以動作
        if(event.key==='Enter'&&event.target.value!==""){
            var inputValue=event.target.value;
            if(inputValue<=0){
                alert("更改後的數量不可為0，如果想要移除此商品則直接點選移除即可!");
            }else{
                var targetLabel=document.getElementById("itemLabel"+i);
                var targetinput=document.getElementById("row"+i);
                //var targetPrice=document.getElementById("priceLabel"+i);
                targetLabel.innerHTML=inputValue;

                /* 必須將原有購物車的數量做出改變*/
                var oldcart=[...cart];
                var oldvalue=oldcart[i];
                oldvalue.itemCount=parseInt(inputValue);
                oldvalue.itemTotal=oldvalue.itemPrice*oldvalue.itemCount;
                //targetPrice.innerHTML=oldvalue.itemTotal+"元";
                //oldcart.splice(i,1,oldvalue);

                console.log(oldcart);
                setCarts(oldcart);
                ReactSession.set("cart",cart);
                /*目前該商品總價格無法同步更改 */
                
                /*將輸入格取消*/
                targetinput.classList.remove("display");
                targetLabel.classList.remove("hidden");
            }
        }
    }

    function CartList(){
        console.log(cart);
        
        const CartItemShow=cart.map((item,i)=>
        <>
            <tr key={i} >
                <td>{i+1}</td>
                <td>{item.itemName}</td>
                <td style={{textAlign:'-webkit-center'}}><label id={'itemLabel'+i} className='countLabel'>{item.itemCount}</label>
                    <input type="number" id={"row"+i} className="editLabel" onKeyDown={(e)=>editEnter(e,i)}/></td>
                <td><label id={'priceLabel'+i}>{(item.itemTotal)}元</label></td>
                <td><Button variant='danger' onClick={()=>deleteItem(i)}>移除</Button></td>
                <td><Button id={'changeBtn'+i} className='changeBtn' variant='danger' onClick={()=>editCount(i)} >變更</Button></td>
            </tr>
           
        </>
            
        )
       

        if(cart.length!==0){
            return(<>
                <table style={{width:'70%'}}>
                    <thead>
                        <tr>
                            <td>編號</td>
                            <td>產品名稱</td>
                            <td>數量</td>
                            <td>總金額</td>
                            <td></td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {CartItemShow}
                    </tbody>
                </table>
                <hr/>
                <TotalLabel/>

            </>)
        }else{
            return(<>
               
                <h2 className='hint'>No items in Cart</h2>

            </>  
            )
            /* <img src={cartEmpty} alt='5555' width={300} height={200} style={{marginLeft:'20%'}}/> */
        }
    }

    
    
    
    
    return(
        <>
            <div className='cart'>
                <CartList/><br/>
                <Button variant='warning' onClick={deleteCart} className='btn deleteCart'>清空購物車</Button>
            </div>
            
        
        </>
    )
}

export default Cart;