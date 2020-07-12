import { uuid } from 'uuidv4';

import FakeAppointmentsRepository from '@domains/appointments/fakes/repositories/FakeAppointmentsRepository';
import Appointment from '@domains/appointments/infra/database/entities/Appointment';
import CreateAppointmentService from '@domains/appointments/services/CreateAppointmentService';
import AppError from '@shared/errors/AppError';

let appointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('Create Appointment', () => {
  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(appointmentsRepository);
  });

  it('should create an appointment', async () => {
    const appointment = await createAppointment.execute({
      provider_id: uuid(),
      customer_id: uuid(),
      type: 'CLASSIC_SHAVING',
      date: new Date(),
    });

    expect(appointment).toHaveProperty('id');
  });

  it('should not create two appointments with the same date', async () => {
    const appointmentData = Object.assign(new Appointment(), {
      provider_id: uuid(),
      customer_id: uuid(),
      type: 'CLASSIC_SHAVING',
      date: new Date(),
    });

    await createAppointment.execute(appointmentData);

    await expect(
      createAppointment.execute(appointmentData),
    ).rejects.toBeInstanceOf(AppError);
  });
});
