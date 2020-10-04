'use strict';

/**
 * This is a Node.JS module to load a user's Identity to his wallet.
 * This Identity will be used to sign transactions initiated by this user.
 * This will accept the organization name for which identity needs to be created as input
 * Identity is then created by reading the corresponding certificate and private key from crypto-config folder
 * Created identity is stored inside respective organization sub-folder of 'identity' folder
 *
 */
//let FabricUserControllers3 = require("./FabricUserController");
//FabricUserControllers3 = new FabricUserControllers();// getting issue here
const fileHelper = require('../../helpers/fileHelper.js');
const { Wallets } = require('fabric-network');//Wallet Library provided by Fabric

const fs = require('fs'); // FileSystem Library
const { FileSystemWallet , X509WalletMixin } = require('fabric-network'); // Wallet Library provided by Fabric
//const  FileSystemWallet  = require('fabric-network');
const path = require('path'); // Support library to build filesystem paths in NodeJs

//Declare ENUMS, all CAPS followed for easy identification
const CRYPTOPATHS = require('../../enums/orgcryptopaths.js'); //List of crypto material relative paths for each org
const ORGMSPIDS = require('../../enums/orgmsps.js'); //List of MSP ID for each org

//Declare constants
const crypto_materials = path.resolve(__dirname, '../../../network/crypto-config'); // Directory where all Network artifacts are stored
const certificateFolder = 'signcerts'; //Folder name inside crypto path which contains Admin certificate
const privatekeyFolder = 'keystore'; //Folder name inside crypto path which contains private key
//let gateway;
/**
 * This function creates wallet for given organization at provided path
 * @param organizationName - Name of the organization to create wallet
 * @param walletPath - Relative folder path to create wallet
 * @param identityLabel - Identity folder to create inside organization wallet
 * @param cryptoDirPath - Directory path which has crypto materials for given org
 * @returns
 */
async function main(organizationName, walletPath, identityLabel, cryptoDirPath) {
  //const wallet = new FileSystemWallet(walletPath);
	// Main try/catch block
  //const wallet=undefined;
	try {
        //console.log(`Wallet path: ${walletPath}`);
        //identify path need to give
      // const wallet = await newFileSystemWallet(walletPath);
       const wallet = new FileSystemWallet(walletPath);
        //const wallet =new FileSystemWallet(walletPath);
      //  console.log(`Wallet path: ${walletPath}`);
        // Identity to credentials to be stored in the wallet
        //const credPath = path.join(fixtures, '/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com');
        //const certificate = fs.readFileSync(path.join(credPath, '/msp/signcerts/User1@org1.example.com-cert.pem')).toString();
        //const privateKey = fs.readFileSync(path.join(credPath, '/msp/keystore/priv_sk')).toString();

        const certFolderPath = path.resolve(cryptoDirPath, certificateFolder);
        const certificatePath = path.resolve(certFolderPath, fileHelper.getSingleFile(certFolderPath));
      //  console.log(`certificatepath path: ${certificatePath}`);
        const keyFolderPath = path.resolve(cryptoDirPath, privatekeyFolder);
        const privateKeyPath = path.resolve(keyFolderPath, fileHelper.getSingleFile(keyFolderPath));
        //console.log(`privateKeyPath: ${privateKeyPath}`);
        const certificate = fs.readFileSync(certificatePath).toString();
		    const privatekey = fs.readFileSync(privateKeyPath).toString();

        //const wallet =new FileSystemWallet();
        //const wallet =new FileSystemWallet(walletPath);
        //const wallet= newFileSystemWallet.wallet(walletPath);
        const identity = X509WalletMixin.createIdentity(ORGMSPIDS[organizationName], certificate, privatekey);
        await wallet.import(identityLabel,identity)
        //const wallet =new FileSystemWallet(walletPath);
				//await wallet.put(identityLabel, identity);
        //const wallet = await Wallets.newFileSystemWallet(walletPath);
      /*const identity = {
    credentials: {
        certificate: certificate,
        privateKey: privatekey,
    },
    mspId: ORGMSPIDS[organizationName],
    type: 'X.509',
};

await wallet.put(identityLabel, identity);
        // Load credentials into wallet
        //const identityLabel = 'mani';

        /*const identity = {
            credentials: {
                certificate,
                privatekey
            },
            mspId: ORGMSPIDS[organizationName],
            type: 'X.509'
        }

        await wallet.put(identityLabel, identity);
*/
	} catch (error) {
		console.log(`Error adding to wallet. ${error}`);
		console.log(error.stack);
		throw new Error(error);
	}
}

module.exports.execute = main;
