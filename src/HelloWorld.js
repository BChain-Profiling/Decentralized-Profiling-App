import React, { useEffect, useState } from "react";
import {
  helloWorldContract,
  connectWallet,
  updateMessage,
  loadCurrentMessage,
  getCurrentWalletConnected,
} from "./util/interact.js";

import alchemylogo from "./oly.png";

const HelloWorld = () => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("No connection to the network.");
  const [newMessage, setNewMessage] = useState("");
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    age: "",
    sex: "",
    email: "",
    birthday: "",
  });
  const [editingPersonalInfo, setEditingPersonalInfo] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const message = await loadCurrentMessage();
      setMessage(message);
    }
    fetchData();
    const smartContractListener = addSmartContractListener(); // Store the listener to remove it later
    const walletListener = addWalletListener(); // Store the listener to remove it later

    // Cleanup function to remove listeners
    return () => {
      smartContractListener.unsubscribe();
      if (window.ethereum) {
        window.ethereum.off("accountsChanged", walletListener);
      }
    };
  }, []);

  function addSmartContractListener() {
    const eventListener = helloWorldContract.events.UpdatedMessages({}, (error, data) => {
      if (error) {
        setStatus(error.message);
      } else {
        setMessage(data.returnValues[1]);
        setNewMessage("");
        setStatus(" Your message has been updated!");
      }
    });

    return eventListener; // Return the event listener to be used for cleanup
  }

  function addWalletListener() {
    if (window.ethereum) {
      const listener = (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏻 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      };

      window.ethereum.on("accountsChanged", listener);
      return listener; // Return the listener to be used for cleanup
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download`}>
            You must install Metamask, a virtual Ethereum wallet, in your browser.
          </a>
        </p>
      );
    }
  }

  // Function to toggle editing mode
  const toggleEditing = () => {
    setEditingPersonalInfo(!editingPersonalInfo);
  };

  // Conditionally render personal information input fields based on editing mode
  const renderPersonalInfoFields = () => {
    if (editingPersonalInfo) {
      return (

        <>
          <h2 style={{ paddingTop: "18px" }}>Edit Personal Information:</h2>
          <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet" />

          <div className="container">
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label text-end">Name:</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                  value={personalInfo.name}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label text-end">Age:</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Age"
                  onChange={(e) => setPersonalInfo({ ...personalInfo, age: e.target.value })}
                  value={personalInfo.age}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label text-end">Sex:</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Sex"
                  onChange={(e) => setPersonalInfo({ ...personalInfo, sex: e.target.value })}
                  value={personalInfo.sex}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label text-end">Email:</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email"
                  onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                  value={personalInfo.email}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label text-end">Birthday:</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Birthday"
                  onChange={(e) => setPersonalInfo({ ...personalInfo, birthday: e.target.value })}
                  value={personalInfo.birthday}
                />
              </div>
            </div>
          </div>

          <button className="btn btn-primary float-end" id="publish" onClick={onUpdatePressed}>
            Update
          </button>
        </>
      );
    } else {
      return (
        <>
          <h2 style={{ paddingTop: "18px" }}>Personal Information:</h2>
          <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet" />

          <div className="container">
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label text-end">Name:</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={parsedPersonalInfo.name || ""}
                  disabled
                  readOnly
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label text-end">Age:</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Age"
                  value={parsedPersonalInfo.age || ""}
                  disabled
                  readOnly
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label text-end">Sex:</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Sex"
                  value={parsedPersonalInfo.sex || ""}
                  disabled
                  readOnly
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label text-end">Email:</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email"
                  value={parsedPersonalInfo.email || ""}
                  disabled
                  readOnly
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label text-end">Birthday:</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Birthday"
                  value={parsedPersonalInfo.birthday || ""}
                  disabled
                  readOnly
                />
              </div>
            </div>
          </div>


        </>
      );
    }
  };

  // Function to handle update button click
  const onUpdatePressed = async () => {
    const { status } = await updateMessage(walletAddress, JSON.stringify(personalInfo));
    setStatus(status);
    // Exit editing mode after updating
    setEditingPersonalInfo(false);
  };

  // Conditionally render edit button based on editing mode
  const renderEditButton = () => {
    if (!editingPersonalInfo) {
      return (
        <button onClick={toggleEditing} className="btn btn-primary float-end" style={{ width: "100px"}}>Edit</button>
      );
    } else {
      return null; // Don't render edit button when editing
    }
  };

  // Parse the JSON string to an object
  const parsedPersonalInfo = isValidJson(message) ? JSON.parse(message) : {};

  // Function to check if a string is valid JSON
  function isValidJson(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Function to handle wallet connection
  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  return (
    <div className="bg-light screen">
      <div className="container-fluid h-100 p-3 pt-5">
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-md-6">
            <div className="card p-4">
              <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet" />

              <img
                id="logo"
                src={alchemylogo}
                className="card-img-top mx-auto d-block mt-5"
                alt="Alchemy Logo"
                style={{ width: "800px", height: "260px" }}
              />

              <div className="card-body">
                <div className="d-flex justify-content-end mb-3">
                  <button className="btn btn-primary" onClick={connectWalletPressed}>
                    {walletAddress.length > 0 ? (
                      "Connected: " +
                      String(walletAddress).substring(0, 6) +
                      "..." +
                      String(walletAddress).substring(38)
                    ) : (
                      <span>Connect Wallet</span>
                    )}
                  </button>
                </div>

                <div>
                  {renderPersonalInfoFields()}
                  {renderEditButton()}
                  <p id="status">{status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default HelloWorld;