import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventStatus } from '../domain/entities/event.entity';
import { JwtAuthGuard } from '../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../auth/infrastructure/decorators/roles.decorator';
import { OptionalJwtAuthGuard } from '../../auth/infrastructure/guards/optional-jwt-auth.guard';
import { Request } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core'; // Actually standard @Req or @Request decorator is better


@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({ status: 201, description: 'The event has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires ADMIN role.' })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all published events' })
  @ApiResponse({ status: 200, description: 'Return all published events.' })
  findAll() {
    return this.eventsService.findAllPublished();
  }

  @ApiBearerAuth()
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all events (Admin)' })
  @ApiResponse({ status: 200, description: 'Return all events.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires ADMIN role.' })
  findAllAdmin() {
    return this.eventsService.findAll();
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming published events' })
  @ApiResponse({ status: 200, description: 'Return upcoming published events.' })
  findUpcoming() {
    return this.eventsService.findUpcoming();
  }

  @ApiBearerAuth()
  @Get(':id/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get event statistics (Admin)' })
  @ApiResponse({ status: 200, description: 'Return event statistics.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires ADMIN role.' })
  getStats(@Param('id') id: string) {
    return this.eventsService.getStats(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get published event by ID' })
  @ApiResponse({ status: 200, description: 'Return the event.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get event by ID (Public: Published only, Admin: All)' })
  @ApiResponse({ status: 200, description: 'Return the event.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  findOne(@Param('id') id: string, @Req() req: any) {
    const user = req.user;
    if (user && user.role === 'ADMIN') {
      return this.eventsService.findOne(id);
    }
    return this.eventsService.findOnePublic(id);
  }

  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update an event' })
  @ApiResponse({ status: 200, description: 'The event has been successfully updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires ADMIN role.' })
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @ApiBearerAuth()
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update event status' })
  @ApiBody({ schema: { type: 'object', properties: { status: { type: 'string', enum: ['PUBLISHED', 'DRAFT', 'COMPLETED', 'CANCELLED'] } } } })
  @ApiResponse({ status: 200, description: 'The event status has been successfully updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires ADMIN role.' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: EventStatus,
  ) {
    return this.eventsService.updateStatus(id, status);
  }
}
