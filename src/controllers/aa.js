//js
//Post Request that handles cadastro
const cadastroCliente = (req, res) => {
    const { name, sobrenome, cpf, celular, endereco, email, senha, confirmar } = req.body;
    if (!name || !email || !senha || !confirmar) {
      console.log("Preencha todos os campos");
    }
    //confirmar senhas
    if (senha !== confirmar) {
      console.log("as senhas devem ser a mesma");
    } 
    else {
      //Validation
      Cliente.findOne({ email: email }).then((cliente) => {
        if (cliente) {
          console.log("email ja esta registrado");
          res.render("cadastro", {
            name,
            email,
            senha,
            confirmar,
          });
        } else {
          //Validation
          const newCliente = new Cliente({
            name,
            sobrenome, 
            cpf, 
            celular,
            email,
            endereco,
            senha,
          });
          //senha Hashing
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newCliente.senha, salt, (err, hash) => {
              if (err) throw err;
              newCliente.senha = hash;
              newCliente
                .save()
                .then(res.redirect("/login"))
                .catch((err) => console.log(err));
            })
          );
        }
      });
    }
  };