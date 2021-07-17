import { HttpRequestException } from './errors';
import AWS from 'aws-sdk';
import { keys } from '../config';

AWS.config.update({ 
	accessKeyId: keys.ACCESS_KEY, 
	secretAccessKey: keys.SECRET_ACCESS_KEY, 
	region: keys.REGION,
});

const lambda = new AWS.Lambda();

const invokeLambda = (params: any, callback?: any) => {
	return lambda.invoke(params).promise().then((response) => {
      if (!response) {
        console.log('Null response!');
        return null;
      }
      return response;
    })
    .catch((error) => {
      console.log(new HttpRequestException(error, 'Error getting response.'));
	});
};

export const generateImage = async (itemIds: Array<number>, callback: Function): Promise<any> => {
	return generateCoordinates(itemIds)
		.then((coordinateInfo) => callImageGenerationBackend(coordinateInfo, callback)
		.then((response) => callback(JSON.parse(response.Payload).url)))
}

export const generateCoordinates = async (itemIds: Array<number>): Promise<any> => {
	return await invokeLambda({
		FunctionName: keys.LAMBDA_GENERATE_COORDINATES, 
		Payload: JSON.stringify({clothes: `[${itemIds.join(", ")}]`})
	});
}

export const callImageGenerationBackend = async (coordinateInfo: any, callback: Function): Promise<any> => {
	return await invokeLambda({
		FunctionName: keys.LAMBDA_BACKEND, 
		Payload: coordinateInfo.Payload
	});
}