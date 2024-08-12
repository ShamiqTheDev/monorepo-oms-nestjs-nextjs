import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Query } from "@nestjs/common";
import { PatientsService } from "./patients.service";
import type { Insertable, Selectable } from "kysely";
import { Auth, DB } from "@atdb/types";
import { CurrentUser, Roles } from "@atdb/server-utils";

@Controller("patients")
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  @Get()
  async getAllPatients(@Query("ownerId") ownerId: string | null = null, @CurrentUser() user: Auth.SessionUser): Promise<Selectable<DB.Patient>[]> {
    if (user.role === DB.Role.Customer) ownerId = user.id;
    return await this.patientsService.getAll(ownerId);
  }
  
  @Get("by-ref/")
  async getPatientByRef(
    @Query("patientRef") patientRef: string,
    @Query("ownerId") ownerId: string | null = null,
    @CurrentUser() user: Auth.SessionUser
  ): Promise<Selectable<DB.Patient>> {
    if (user.role === DB.Role.Customer) ownerId = user.id;
    
    if (!patientRef) {
      throw new BadRequestException('Missing required query parameters: patientRef');
    }
    
    const patient = await this.patientsService.findOneByRef(patientRef, ownerId);
    if (!patient) throw new NotFoundException();
    return patient;
  }
  
  @Get(":patientId")
  async getPatientById(@Param("patientId") patientId: number): Promise<Selectable<DB.Patient>> {
    const patient = await this.patientsService.findOne(patientId);
    if (!patient) throw new NotFoundException();
    return patient;
  }

  @Roles(DB.Role.Superadmin, DB.Role.Admin)
  @Post("bulk")
  async createBulkPatients(@Body() patients: Insertable<DB.Patient>[]) {
    await this.patientsService.createBulk(patients);
  }

  @Roles(DB.Role.Superadmin, DB.Role.Admin)
  @Delete()
  async deleteAllPatients(@Query("ownerId") ownerId: string = null) {
    await this.patientsService.deleteAll(ownerId);
  }

  @Post()
  async createPatient(@Body() patient: Insertable<DB.Patient>, @CurrentUser() user: Auth.SessionUser): Promise<{ id: number }> {
    if (user.role === DB.Role.Customer) patient.ownerId = user.id;
    return await this.patientsService.create(patient);
  }
}
