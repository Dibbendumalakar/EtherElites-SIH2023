import { useEffect, useState } from "react";
import certificate from "./artifacts/contracts/Certificate.sol/Certificate.json";
import BirthCertificate from "./components/BirthCertificate";
import ShowCertificate from "./components/ShowCertificate";
import { ethers } from "ethers";
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import SignUp from "./components/auth/SignUp";
import Notify from "./components/auth/Notify";
import Verified from "./components/auth/Verified";
import Home from "./components/Home/Home";
import SignIn from "./components/auth/SignIn";
import LandDeed from "./components/Forms/LandDeed";
import { AuthProvider } from "./components/auth/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const loadProvider = async () => {
      try {
        if (provider) {
          window.ethereum.on("accountsChanged", () => window.location.reload());
          window.ethereum.on("chainChanged", () => window.location.reload());
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);
          let contractaddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
          const contract = new ethers.Contract(
            contractaddress,
            certificate.abi,
            signer
          );
          setContract(contract);
          setProvider(provider);
        } else {
          alert("Metamask is not installed in your browser :(");
        }
      } catch (error) {
        console.log(error);
      }
    };
    provider && loadProvider();
  }, []);

  return (
    <AuthProvider>
      <Box
        className="App"
        sx={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <Routes>
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/notify" element={<Notify />} />
          <Route path="/auth/:id/verify/:token" element={<Verified />} />
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/create-birth-certificate"
            element={
              <ProtectedRoute>
                <BirthCertificate contract={contract} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/certificate/:id/birth-certificate/:txid"
            element={
              <ProtectedRoute>
                <ShowCertificate contract={contract} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/LandDeed"
            element={
              <ProtectedRoute>
                <LandDeed />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Box>
    </AuthProvider>
  );
}

export default App;
