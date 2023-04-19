import { Body, Controller, Post } from "@nestjs/common";
import CreateUserDTO from "./DTOs/User.dto";
import UserService from "./user.service";
import ChangePasswordDTO from "./DTOs/ChangePassword.dto";
import AuthUserDTO from "./DTOs/AuthUser.dto";

@Controller("user")
export default class UserController {

    constructor(
        private service: UserService
    ) {

    }

    @Post()
    create(@Body() body: CreateUserDTO) {
        return this.service.create(body)
    }

    @Post('/auth')
    auth(@Body() body: AuthUserDTO) {
        return this.service.auth(body)
    }

    @Post("forgot-password")
    recoverPass(@Body() body) {
        const {email} = body
        return this.service.recoverPass(email)
    }

    @Post("validate-token")
    validatePasswordToken(@Body() body){
        return this.service.validatePasswordToken(body.token)
    }

    @Post('change-password')
    async changePassword(@Body() body: ChangePasswordDTO){
        return this.service.updatePassword(body)
    }
}