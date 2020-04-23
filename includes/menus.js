const conn = require('./db')
const path = require('path');

module.exports = {

    getMenus(){

        return new Promise((resolve, reject) => {

            conn.query(`
            SELECT * FROM tb_menus ORDER BY title
            `, (err, results)=>{

                if (err){
                    reject(err)
                }
        
                resolve(results)

            })

         })
    },

    save(fields, files){
        return new Promise((resolve, reject) => {

            fields.photo = `images/${path.parse(files.photo.path).base}`

            let query, queryPhoto = '', params = [
                fields.title,
                fields.description,
                fields.price
            ]

            if (files.photo.name) {

                query.photo = ',photo = ?'

                params.push(fields.photo)

            }

            if (parseInt(fields.id) > 0){

                params.push(fields.id)

                query =  `
                    UPDATE tb_menus
                    SET title = ?,
                        description = ?,
                        price = ?,
                        ${query.photo}
                    WHERE id = ?
                `
                
            } else {

                if(!fields.photo.name){
                    reject('Envie a foto do prato.')
                }

                query = `
                    INSERT INTO tb_menus (title, description, price, photo)
                    VALUE(?, ?, ?, ?)
                `
            }
            
            conn.query(query, params, (err, results)=>{

                if(err){
                    reject(err)
                } else {
                    resolve(results)
                }

            })
            
        });
    },

    delete(id){

        return new Promise((resolve, reject) => {

            conn.query(`
                DELETE FROM tb_menus WHERE id = ?
            `[
                id
            ], (err, results)=>{

                if(err){
                    reject(err)
                } else {
                    resolve(results)
                }

            })
            
        })

    }

}