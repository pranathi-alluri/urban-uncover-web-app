import * as client from "./client";
import { useState, useEffect } from "react";
import {Link, useNavigate} from "react-router-dom";
function EditAccount() {
    const [account, setAccount] = useState(null);
    const navigate = useNavigate();
    const fetchAccount = async () => {
        const account = await client.account();
        setAccount(account);
    };
    const save = async () => {
        await client.updateUser(account);
        navigate("/profile");
    };


    useEffect(() => {
        fetchAccount();
    }, []);
    return (
        <div>
            <h1 className="m-3"> Edit Account</h1>
            {account && (
                <div className="m-4">
                    <input value={account.password}
                           className="form-control mb-3"
                           placeholder="Password"
                           onChange={(e) => setAccount({ ...account,
                                                           password: e.target.value })}/>
                    <input value={account.firstName}
                           className="form-control mb-3"
                           placeholder="First Name"
                           onChange={(e) => setAccount({ ...account,
                                                           firstName: e.target.value })}/>
                    <input value={account.lastName}
                           className="form-control mb-3"
                           placeholder="Last Name"
                           onChange={(e) => setAccount({ ...account,
                                                           lastName: e.target.value })}/>
                    <input value={account.email}
                           className="form-control mb-3"
                           placeholder={"Email"}
                           onChange={(e) => setAccount({ ...account,
                                                           email: e.target.value })}/>

                    <input value={account.phoneNumber}
                           className="form-control mb-3"
                           placeholder={"Phone Number"}
                           type="tel"
                           pattern="[0-9]{10}"
                           onChange={(e) => {
                               const inputPhoneNumber = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                               if (inputPhoneNumber.length <= 10) {
                                   setAccount({ ...account, phoneNumber: inputPhoneNumber });
                               }
                           }}/>

                    <input
                        value={account.address?.street || ""}
                        className="form-control mb-3"
                        placeholder="Street"
                        onChange={(e) =>
                            setAccount({
                                           ...account,
                                           address: { ...account.address, street: e.target.value },
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
                                           address: { ...account.address, city: e.target.value },
                                       })
                        }
                    />
                    <input
                        value={account.address?.state || ""}
                        className="form-control mb-3"
                        placeholder="State"
                        onChange={(e) =>
                            setAccount({
                                           ...account,
                                           address: { ...account.address, state: e.target.value },
                                       })
                        }
                    />
                    <input
                        value={account.address?.zipCode || ""}
                        className="form-control mb-3"
                        placeholder="Zip Code"
                        onChange={(e) =>
                            setAccount({
                                           ...account,
                                           address: { ...account.address, zipCode: e.target.value },
                                       })
                        }
                    />

                    <button className="btn btn-primary w-100" onClick={save}>
                        Save
                    </button>
                </div>
            )}
        </div>
    );
}
export default EditAccount;