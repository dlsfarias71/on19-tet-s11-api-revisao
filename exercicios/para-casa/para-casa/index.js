
const express = require ("express");
const { ClientRequest } = require("http");
const { CLIENT_RENEG_WINDOW } = require("tls");
const app = express()
const port = 3002;
const uuid = require ("uuid")
const IDUnico = uuid.v4()
const GerarNovoNumeroConta = Math.random();
const listaClientesBanco = require("./model/contas-clientes")

app.use(express.json());



//Criar os clientes do banco, foi utilizado o método post (concluido)


app.post("/clientes/add",(req,res) => {
    const {nome_cliente, cpf_cliente, cliente,data_nascimento,
        conta:{tipo,saldo}} = req.body;
  
    const dataAberturaConta = new Date();
   
    const novoCliente = {
        
        id : uuid.v4(),
        nome_cliente  ,
        cpf_cliente,
        cliente,
        data_nascimento,
conta:{
        numero:Math.floor(Math.random()*10000),
        tipo ,
        saldo,
        data_criação :dataAberturaConta.toISOString(),
    
},
    }
    listaClientesBanco.push(novoCliente)
return res.status(201).json(listaClientesBanco)
    
});


//- Atualizar informações desses clientes ( telefone de contato e tipo de conta atualizados...(Concluido)

     
app.patch("/cliente/:id",(req,res) => {

    const idcliente = req.params.id
    const dadoAlterado = req.body
   
 
     const  dadosCliente = listaClientesBanco.find(cliente => cliente.id == idcliente)
     if(dadosCliente){
        const dadosAtualizados = {
            ...dadosCliente,
            ...dadoAlterado
          
        }

         listaClientesBanco.map((cliente,index) => {
            if(cliente.id == idcliente){
                return listaClientesBanco[index] = dadosAtualizados
      }

    
     })
     return res.status(200).json(listaClientesBanco)

    
}
return res.status(404).json({message:"Cliente não encontrado"})
})


//Conseguir Filtrar os clientes do banco pelo seu nome,por saldo...(Concluido)

app.get('/clientes',(req,res)=>{
  const filtraNumero = req.query.numero
  const FiltraTipoConta = req.query.tipoConta?.toLowerCase()

    const procurarCliente = listaClientesBanco.filter((conta) => {
    
      if(filtraNumero){
        return conta.conta.numero == filtraNumero;
      }
     
      if (FiltraTipoConta) {
        return conta.conta.tipo == FiltraTipoConta;
      }
      return conta


    })
    return res.status(200).json(procurarCliente);
 
})




   // - Fazer depósitos / pagamentos usando o saldo de sua conta(In Progress)

  
   app.patch("/cliente/:id/deposito",(req,res) => {

    const idcliente = req.params.id
    const {deposito}= req.body
   
     const clienteDoBanco = listaClientesBanco.find(cliente=> cliente.id == idcliente)

     if(clienteDoBanco) {

     const novoSaldo = {
      ...clienteDoBanco.conta,
      saldo: clienteDoBanco.conta.saldo + deposito ,
     };


     console.log(novoSaldo)     
      return res.status(200).json(novoSaldo);

     }


   })

   app.patch("/cliente/:id/pagamento",(req,res) => {

    const idcliente = req.params.id
    const {valorBoleto} = req.body
   
 
     const clienteDoBanco = listaClientesBanco.find(cliente => cliente.id == idcliente)


     if (valorBoleto <= clienteDoBanco.conta.saldo ){

      const pagamento = {
        ...clienteDoBanco.conta.saldo - valorBoleto
      };


      listaClientesBanco.map((cliente, index) => {
        if (cliente.id == idcliente) {
          listaClientesBanco[index].conta = pagamento
        }

    });
return res.status(200).json(pagamento + ` Pagamento foi realizado `) 


     }

     return res.status(400).json( 'Saldo insuficiente' );  

   })




//- Encerrar contas de clientes(concluido)

app.delete("/cliente/:id", (req, res) => {

  const idcliente = req.params.id

  const clienteTemConta = listaClientesBanco.find((cliente)=> cliente.id == idcliente)

  if(clienteTemConta){
      listaClientesBanco.map((cliente,index)=>{
          if(cliente.id == idcliente){
              return listaClientesBanco.splice(index,1)
          }
       
      })
      return res.status(200).json({
         message:`O cliente ${clienteTemConta.nome_cliente} foi encontrado e a conta foi encerrada `})
        
  }
  return res.status(404).json({
      message:"Esse cliente não existe"
  })

 


})

	

app.listen(port, () => {
    console.log(`API está rodando na porta ${port}`);
  });