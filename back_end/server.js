import express from 'express';
 import mysql from 'mysql';
 import cors from'cors';



 // creation d'un application express
    const app = express();
    app.use(express.json());
    app.use(cors());

// connection to data base
  const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"fares@585634/",
    database:"bibliothèque"
  })  
   /* test la connection avac la base de donnée */
   db.connect((err) => {
    if (err) {
      console.error('Erreur de connexion à la base de données :', err);
    } else {
      console.log('Connecté à la base de données MySQL');
    }
  });

  // simple message pour test simple API
   app.get('/',(req,res)=>{
      res.json({message:"hello it's back end !!!"});
   });

   // API pour upload la list des book sur front 
   app.get('/Book_List',(req,res)=>{
     const sql="SELECT bookID,title,category,cover,linkShop,description FROM Book";
     db.query(sql,(err,data)=>{
       if( err) return res.json(err);
       return res.json(data);
     })
   });

   // API pour  upload la list des utilisateur 
   app.get('/Users_List',(req,res)=>{
    const sql="SELECT userID,user_Name,phone,gmail FROM Userr";
    db.query(sql,(err,data)=>{
      if( err) return res.json(err);
      return res.json(data);
    })
  });

  //API pour insert les donnes des utilisateur dans la base de donnees
  app.post('/Users_List',(req,res)=>{
    const sql= "INSERT INTO Userr (`user_Name`,`phone`,`gmail`,`passwordd`,`user_cover`) VALUES (?)";
    const valeur=[
       req.body.user_Name,
       req.body.phone,
       req.body.gmail,
       req.body.passwordd,
       req.body.user_cover,
      
    ]
    db.query(sql,[valeur],(err,data)=>{
      if( err) return res.json(err);
      return res.json("user created successfully!!")  
         })
  });

  // API pour supprime un utilisateur 
  app.delete('/Users_List/:userID', (req, res) => {
    const userIDToDelete = req.params.userID;
    const deleteSql = "DELETE FROM Userr WHERE userID = ?";
    db.query(deleteSql, [userIDToDelete], (err, result) => {
        if (err) {
            return res.json(err);
        }
       // Mise à jour des identifiants d'utilisateur restants 
        const updateUserIdsSql = "UPDATE Userr SET userID = userID - 1 WHERE userID > ?";
        db.query(updateUserIdsSql, [userIDToDelete], (err, result) => {
            if (err) {
                return res.json(err);
            }
            return res.json("Utilisateur supprimé avec succès.");
        });
    });
});


  // API pour la creation des livres 
     app.post('/Add_book',(req,res)=>{
       const sql= "INSERT INTO Book (`title`,`category`,`publisher_date`,`cover`,`linkShop`,`description`) VALUES (?)";
       const valeur=[
          req.body.title,
          req.body.category,
          req.body.publisher_date,
          req.body.cover,
          req.body.linkShop,
          req.body.description
       ]
       db.query(sql,[valeur],(err,data)=>{
         if( err) return res.json(err);
         return res.json("book created succesfully!!")  
            })
     });
     /*app.post('/Add_book', (req, res) => {
    const bookValues = [
        req.body.title,
        req.body.category,
        req.body.publisher_date,
        req.body.cover,
        req.body.linkShop,
        req.body.description
    ];

    let authorID, publisherID;

    // Insérer l'auteur s'il n'existe pas déjà
    db.query("INSERT INTO Author (`auth_Name`, `date_Birth`, `nationality`) VALUES (?, ?, ?)", [req.body.auth_Name, req.body.date_Birth, req.body.nationality], (err, result) => {
        if (err) return res.json(err);
        authorID = result.insertId;

        // Insérer l'éditeur s'il n'existe pas déjà
        db.query("INSERT INTO Publisher (`pub_Name`) VALUES (?)", [req.body.pub_Name], (err, result) => {
            if (err) return res.json(err);
            publisherID = result.insertId;

            // Insérer le livre avec les IDs d'auteur et d'éditeur
            db.query("INSERT INTO Book (`title`, `category`, `publisher_date`, `cover`, `linkShop`, `description`, `publisherID`) VALUES (?, ?, ?, ?, ?, ?, ?)", [...bookValues, publisherID], (err, result) => {
                if (err) return res.json(err);

                // Insérer les relations dans la table de jonction
                db.query("INSERT INTO AuthorBook (`authorID`, `bookID`) VALUES (?, ?)", [authorID, result.insertId], (err, result) => {
                    if (err) return res.json(err);

                    return res.json("Book created successfully!");
                });
            });
        });
    });
});
 */



 /* connection to port 8801 */
      const PORT=8801;
      app.listen(PORT,()=>{
         console.log(`Serveur démarré sur le port ${PORT}`);
      });