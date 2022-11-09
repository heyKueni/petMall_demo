const query = require('../../utils/dbQuery')

module.exports = {
  checkPetExist: (data) => {
    const sql = `select * from pet as p join pet_type as pt on p.pOwner=? and p.pType=pt.ptId`
    return query(sql, [data.uId])
  },
}
