import { Controller, Post, Body, UseGuards, Request, Patch, Param, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import type { Response } from 'express';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';
import { JwtAuthGuard } from '../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../auth/infrastructure/decorators/roles.decorator';
import { ReservationStatus } from '../domain/entities/reservation.entity';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a reservation' })
  @ApiResponse({ status: 201, description: 'The reservation has been successfully created.' })
  create(@Request() req, @Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto, req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/status')
  @ApiOperation({ summary: 'Update reservation status (Admin)' })
  @ApiResponse({ status: 200, description: 'The reservation status has been successfully updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires ADMIN role.' })
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateReservationStatusDto) {
    return this.reservationsService.updateStatus(id, updateStatusDto.status);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a reservation' })
  @ApiResponse({ status: 200, description: 'The reservation has been successfully cancelled.' })
  async cancel(@Param('id') id: string, @Request() req) {
    return this.reservationsService.cancelByUser(id, req.user.userId); 
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id/ticket')
  @ApiOperation({ summary: 'Generate reservation ticket' })
  @ApiResponse({ status: 200, description: 'Ticket generated successfully.' })
  async generateTicket(@Param('id') id: string, @Request() req, @Res() res: Response) {
    const buffer = await this.reservationsService.generateTicket(id, req.user.userId);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=ticket-${id}.pdf`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('by-event/:eventId')
  @ApiOperation({ summary: 'Find reservations by event (Admin)' })
  @ApiResponse({ status: 200, description: 'Return reservations for the event.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires ADMIN role.' })
  findByEvent(@Param('eventId') eventId: string) {
    return this.reservationsService.findByEvent(eventId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my-reservations')
  @ApiOperation({ summary: 'Find my reservations' })
  @ApiResponse({ status: 200, description: 'Return my reservations.' })
  findAllMine(@Request() req) {
    return this.reservationsService.findByUser(req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('by-user/:userId')
  @ApiOperation({ summary: 'Find reservations by user (Admin)' })
  @ApiResponse({ status: 200, description: 'Return reservations for the user.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires ADMIN role.' })
  findByUser(@Param('userId') userId: string) {
    return this.reservationsService.findByUser(userId);
  }
}
