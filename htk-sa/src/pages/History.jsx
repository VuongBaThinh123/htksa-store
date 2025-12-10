import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function History(){
  const { orders, addFeedback } = useCart()
  const { toast } = useToast()
  const [editing, setEditing] = useState({})

  const save = (orderId, itemId) => {
    const key = `${orderId}_${itemId}`
    const value = editing[key] || ''
    addFeedback(orderId, itemId, value)
    toast('Feedback saved')
  }

  if(!orders || orders.length===0) return (
    <div className="container section">
      <h2>No order history yet</h2>
      <p>Your past purchases will show here after checkout.</p>
    </div>
  )

  return (
    <div className="container section">
      <h1 style={{fontSize:28, fontWeight:800}}>Order History</h1>
      <div style={{display:'grid', gap:12, marginTop:12}}>
        {orders.map(order => (
          <div className="card" key={order.id}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <div style={{fontWeight:800}}>Order #{order.id}</div>
                <div style={{fontSize:13, color:'var(--muted)'}}>{new Date(order.createdAt).toLocaleString()}</div>
              </div>
              <div style={{fontWeight:800}}>${(order.total||0).toFixed(2)}</div>
            </div>
            <div style={{marginTop:12, display:'grid', gap:8}}>
              {order.items.map(it => (
                <div key={it.id} style={{display:'flex', gap:12, alignItems:'flex-start'}}>
                  <img src={it.image} alt={it.name} style={{width:88, height:64, objectFit:'cover', borderRadius:8}} />
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700}}>{it.name} <span style={{fontWeight:600, color:'var(--muted)'}}>x{it.qty}</span></div>
                    <div style={{fontSize:13, color:'var(--muted)'}}>${it.price.toFixed(2)}</div>
                    <div style={{marginTop:8}}>
                      <textarea
                        placeholder="Leave feedback for this item"
                        value={editing[`${order.id}_${it.id}`] ?? (it.feedback || '')}
                        onChange={e => setEditing(s => ({ ...s, [`${order.id}_${it.id}`]: e.target.value }))}
                        style={{width:'100%', minHeight:80}}
                      />
                      <div style={{display:'flex', gap:8, marginTop:8}}>
                        <button className="btn" onClick={()=> setEditing(s=> ({ ...s, [`${order.id}_${it.id}`]: it.feedback || '' }))}>Reset</button>
                        <button className="btn btn-primary" onClick={()=> save(order.id, it.id)}>Save feedback</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
