import { User } from "../graphql/typedefs/models/user-models.js";

//Class for validating user email and phone when he registers into the website checks email or phone is already existing or not
class ValidationHelpers {
  async checkEmail(email) {
    console.log("Checking email:", email); 
    try {
      const user = await User.findOne({
        where: { email: email },
      });
      return !!user; 
    } catch (error) {
      console.error("Error checking email:", error);
      throw new Error("Database query failed"); 
    }
  }

  async checkPhone(phone) {
    console.log("Checking phone:", phone);
    try {
      const user = await User.findOne({
        where: { phone: phone },
      });
      return !!user; 
    } catch (error) {
      console.error("Error checking phone:", error);
      throw new Error("Database query failed"); 
    }
  }
}


export default ValidationHelpers
