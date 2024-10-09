import mongoose from 'mongoose';
//mongo connection
const mongoURL = process.env.MONGO_URL!;
const mongoDbName = process.env.MONGO_DB_NAME!;

let SampleModel: mongoose.Model<any>;

export const connectToDatabase = async () => {
    try {
      // Connect to MongoDB
      await mongoose.connect(`${mongoURL}/${mongoDbName}`);
      console.log(`Connected to database: ${mongoDbName}`);
  
      // Create a schema and model (for collection creation)
      const sampleSchema = new mongoose.Schema({
        objectId: String,
        fileName: String,
        extension: String,
        views: Number,
      });
  
      const SampleModel = mongoose.models.Videos || mongoose.model('Videos', new mongoose.Schema);
  
      // Check if the collection exists
      const collectionExists = await mongoose.connection.db
        .listCollections({ name: 'Videos' }) // Use the correct collection name here
        .hasNext();
  
      if (!collectionExists) {
        console.log('Creating collection: Videos');
        
        console.log('Collection created!');
      } else {
        console.log('Collection already exists.');
        await SampleModel.init(); // Creates the collection based on the model
      }
      return SampleModel;
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
  };
  
 