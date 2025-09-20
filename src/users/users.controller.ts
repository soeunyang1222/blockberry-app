import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '사용자 생성' })
  @ApiResponse({ status: 201, description: '사용자가 성공적으로 생성되었습니다.', type: User })
  @ApiResponse({ status: 409, description: '이미 존재하는 지갑 주소입니다.' })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: '모든 사용자 조회' })
  @ApiResponse({ status: 200, description: '사용자 목록을 성공적으로 조회했습니다.', type: [User] })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '사용자 ID로 조회' })
  @ApiResponse({ status: 200, description: '사용자를 성공적으로 조회했습니다.', type: User })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Get('wallet/:wallet_address')
  @ApiOperation({ summary: '지갑 주소로 사용자 조회' })
  @ApiResponse({ status: 200, description: '사용자를 성공적으로 조회했습니다.', type: User })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
  findByWalletAddress(@Param('wallet_address') wallet_address: string): Promise<User> {
    return this.usersService.findByWalletAddress(wallet_address);
  }

  @Delete(':id')
  @ApiOperation({ summary: '사용자 삭제' })
  @ApiResponse({ status: 200, description: '사용자가 성공적으로 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
