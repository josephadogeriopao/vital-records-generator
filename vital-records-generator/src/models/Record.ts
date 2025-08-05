class Record {
    private ssn : string = "";
    private owner: string = "";
    private rescode: string = "";
    private address: string = "";
    private city: string = "";
    private dob: string = "";
    private dod: string = "";
    private sex: string = "";
    private age: string = "";

    constructor(){ }
    setSSN = (ssn: string) => this.ssn = ssn;

    setOwner = (owner: string) => this.owner = owner;

    setResCode = (rescode: string) => this.rescode = rescode;

    setAddress = (address: string) => this.address = address;

    setCity = (city: string) => this.city = city;

    setDOB = (dob: string) => this.dob = dob;

    setDOD = (dod: string) => this.dod = dod;

    setSex = (sex: string) => this.sex = sex;

    setAge = (age: string) => this.age = age;

    getSSN = () : string => this.ssn;

    getOwner = () : string => this.owner;

    getResCode = () : string => this.rescode;

    getAddress = () : string => this.address;

    getCity = () : string => this.city;

    getDOB = () : string => this.dob;

    getDOD = () : string => this.dod;

    getSex = () : string => this.sex;

    getAge = () : string => this.age;

    toArray = () : string[] => {
        return [this.getSSN(),this.getOwner(),this.getResCode(),this.getAddress(),
                this.getCity(),this.getDOB(),this.getDOD(),this.getSex(),this.getAge()
        ]
    }
    instance =()=>{
        return {
            ssn: this.ssn,
            owner : this.owner,
            rescode: this.rescode,
            address: this.address,
            city: this.city,
            dob: this.dob,
            dod: this.dod,
            sex: this.sex,
            age: this.age
        }
    }
}

export default Record;