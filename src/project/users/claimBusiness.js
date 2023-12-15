import React, {useEffect, useState} from "react";
import * as client from "./client";
import * as yelp from "../client";
import {useNavigate} from "react-router-dom";
import {FaSignOutAlt} from "react-icons/fa";

function ClaimBusiness() {
    const [account, setAccount] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    const fetchAccount = async () => {
        const account = await client.account();
        setAccount(account);
    };

    useEffect(() => {
        fetchAccount();
        console.log(account)
    }, []);

    const verifyBusiness = async () => {
        try {
            if (account.claimedBusiness) {
                setErrorMessage("You can not claim multiple businesses");
                return;
            }
            if (
                !account.businessName ||
                !account.address?.street ||
                !account.address?.city ||
                !account.address?.state
            ) {
                setErrorMessage("Please provide all required fields.");
                return;
            }

            const response = await yelp.verifyBusiness({
                                                           name: account.businessName,
                                                           address: account.address.street,
                                                           city: account.address.city,
                                                           state: account.address.state
                                                       });

            if (response.businesses && response.businesses.length > 0) {
                const yelpBusiness = response.businesses[0];

                await client.updateUser({
                                            ...account,
                                            claimedBusiness: yelpBusiness.id,
                                            businessName: yelpBusiness.name
                                        })
                navigate("/profile")
            } else {
                setErrorMessage(
                    "No matches found. Not a valid business to claim. Please try again.");
            }
        } catch (error) {
            setErrorMessage("Error verifying business. Please try again.");
        }
    }

    return (
        <div>
            {!account && (
                <button className="btn btn-danger" onClick={() => {
                    navigate('/login')
                }}>
                    <FaSignOutAlt className="me-2"/>
                    Log in
                </button>
            )}
            {account && account.role !== "BUSINESS" && (
                <h2>Unauthorized</h2>
            )}
            {account && account.role === "BUSINESS" && (
                <div>
                    <h1>Claim Your Business</h1>
                    {!account && (
                        <div> Loading...</div>
                    )}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    {account && (
                        <form>
                            <input
                                value={account?.businessName || ""}
                                className="form-control mb-3"
                                placeholder="Business Name"
                                onChange={(e) =>
                                    setAccount({
                                                   ...account,
                                                   businessName: e.target.value,
                                               })
                                }
                            />
                            <input
                                value={account.address?.street || ""}
                                className="form-control mb-3"
                                placeholder="Street"
                                onChange={(e) =>
                                    setAccount({
                                                   ...account,
                                                   address: {
                                                       ...account.address,
                                                       street: e.target.value
                                                   },
                                               })
                                }
                            />
                            <input
                                value={account.address?.city || ""}
                                className="form-control mb-3"
                                placeholder="City"
                                onChange={(e) =>
                                    setAccount({
                                                   ...account,
                                                   address: {
                                                       ...account.address,
                                                       city: e.target.value
                                                   },
                                               })
                                }
                            />
                            <input
                                value={account.address?.state || ""}
                                className="form-control mb-3"
                                placeholder="State Abbreviation"
                                maxLength={2}
                                onChange={(e) =>
                                    setAccount({
                                                   ...account,
                                                   address: {
                                                       ...account.address,
                                                       state: e.target.value
                                                   },
                                               })
                                }
                            />
                            <button type="button" onClick={verifyBusiness}>Claim Business</button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );

}

export default ClaimBusiness;