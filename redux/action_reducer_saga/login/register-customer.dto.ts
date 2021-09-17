export default class RegisterCustomerDTO {
    EMAIL: string;
    PASSWORD: string;
    FIRST_NAME: string;
    LAST_NAME: string;
    PHONE: string;

    constructor(
        EMAIL: string,
        PASSWORD: string,
        FIRST_NAME: string,
        LAST_NAME: string,
        PHONE: string
    ) {
        this.EMAIL = EMAIL;
        this.PASSWORD = PASSWORD;
        this.FIRST_NAME = FIRST_NAME;
        this.LAST_NAME = LAST_NAME;
        this.PHONE = PHONE;
    }
}