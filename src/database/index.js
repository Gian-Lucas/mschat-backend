const mongoose = require("mongoose");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    "mongodb+srv://gian:O278XC2IDYI1uws6@cluster0.ocxgf.mongodb.net/mschat?retryWrites=true&w=majority"
  );
}

module.exports = mongoose;
