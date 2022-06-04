import datetime
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.utils import timezone
from .models import Appointment, Service, Shift
from .forms import MakeAppointment
import json

list_of_times = [
    datetime.time(9, 0), datetime.time(9, 30), datetime.time(10, 0), datetime.time(10, 30),
    datetime.time(11, 0), datetime.time(11, 30), datetime.time(12, 0), datetime.time(12, 30),
    datetime.time(13, 0), datetime.time(13, 30), datetime.time(14, 0), datetime.time(14, 30),
    datetime.time(15, 0), datetime.time(15, 30), datetime.time(16, 0), datetime.time(16, 30),
    datetime.time(17, 0), datetime.time(17, 30), datetime.time(18, 0), datetime.time(18, 30),
    datetime.time(19, 0), datetime.time(19, 30), datetime.time(20, 0), datetime.time(20, 30)
]

def index(request):
    if request.user.is_authenticated:
        if request.user.profile.role == 'A':
            return redirect('admin')
        elif request.user.profile.role == 'E':
            return redirect('employee')
        elif request.user.profile.role == 'C':
            return redirect('client')
    return redirect('login')

def client(request):
    if request.user.is_authenticated and request.user.profile.role == 'C':
        ap_list = Appointment.objects.filter(client=request.user.profile, date__gte=timezone.now()).order_by('date')
        if request.method == 'POST':
            form = MakeAppointment(request.POST)
            if form.is_valid():
                appointment = form.save()
                appointment.client = request.user.profile
                appointment.save()
                return redirect('office')
        else:
            form = MakeAppointment()
        return render(request, 'client.html', {'form': form, 'ap_list': ap_list})
    return redirect('office')

def admin(request):
    if request.user.is_authenticated and request.user.profile.role == 'A':
        return render(request, 'admin.html')
    return redirect('office')

def employee(request):
    if request.user.is_authenticated and request.user.profile.role == 'E':
        return render(request, 'employee.html')
    return redirect('office')

# возвращает список из БД Записи
def get_appointments(request):
    this_user = request.user
    if this_user.is_authenticated:
        appointment_list = Appointment.objects.all() # для админа - все записи
        if this_user.profile.role == 'E': # для сотрудника - только его подтвержденные
            appointment_list = appointment_list.filter(shift__in=Shift.objects.filter(master=this_user.profile, status='S'))
        appointments = json.dumps([{ # отдаем в json-формате все нужные поля
            'id': a.id, 
            'client': a.client.user.first_name,
            'date': str(a.date).split('-'),
            'time': str(a.time).split(':'),
            'service': str(a.service),
            'shift': str(a.shift)
            } for a in appointment_list])
        return HttpResponse(appointments)
    return HttpResponse('Error')

# возвращает список всех смен, только для админа
def get_shifts_all(request):
    if request.user.is_authenticated and request.user.profile.role == 'A':
        shifts_calendar = json.dumps([{
            'id': s.id,
            'date': str(s.date).split('-'),
            'master': s.master.user.get_full_name(),
            'status': s.status,
            'room': s.get_room(s.room)
            } for s in Shift.objects.all()])
        return HttpResponse(shifts_calendar)
    return HttpResponse('Error')

# возвращает список всех смен сотрудника по статусу, только для сотрудника
def get_shifts_for_employee(request, status):
    this_user = request.user
    if this_user.is_authenticated and this_user.profile.role == 'E':
        list_of_shifts = json.dumps([{
            'id': s.id,
            'date': str(s.date).split('-'),
            'room': s.get_room(s.room)
            } for s in Shift.objects.filter(master=this_user.profile, status=status).order_by('date')])
        return HttpResponse(list_of_shifts)
    return HttpResponse('Error')

# подтверждение от сотрудника смены по id, только для сотрудника
def post_shifts_confirm(request, id):
    this_user = request.user
    if this_user.is_authenticated and this_user.profile.role == 'E' and request.method == 'POST':
        shift = Shift.objects.get(pk=id)
        shift.status = 'S'
        shift.save()
        return HttpResponse('Success')
    return HttpResponse('Error')

# возвращает список занятого времени смены по записям
def get_time_list(ap_list):
    time_list = [] # здесь будет все занятое время смены
    for ap in ap_list: # ходка по всем записям смены
        rep = ap.service.duration//30 + 1 # считаем длительность записи в количестве полчасов + 1 повторение для перерыва
        this_time = ap.time # начальное время записи
        for _ in range(rep): # считаем все время записи по 30 минут, исходя из ее длительности
            time_list.append(this_time) # добавляем время в общий список
            minutes = this_time.minute + 30 # добавляем 30 минут ко времени
            this_time = datetime.time(this_time.hour + minutes // 60, minutes % 60) # считаем новое время
    return time_list # возвращаем список занятого времени

# возвращает список свободного времени на дату, исходя из длительности услуги
def get_time_for_appointment(request, year, month, day, service_id):
    service = Service.objects.get(pk=service_id) # смотрим услугу
    service_room = service.room # смотрим зал услуги
    service_list = Service.objects.filter(room=service_room) # выбираем список услуг, которые предоставляются в этом зале
    date = timezone.datetime(year, month, day) # считаем нужную дату от клиента
    appointment_list = Appointment.objects.filter(date=date, service__in=service_list) # выбираем список записей по дате и услугам этого зала
    shift_list = Shift.objects.filter(date=date, room=service_room) # выбираем список смен по дате и этому залу
    if not shift_list: # если нет ни одной смены
        shift_list = [None] # то считать, что есть только одна смена
    list_of_free_times_in_shifts = [] # здесь будет список всего свободного времени на дату
    for sh in shift_list: # идем по всем сменам даты
        ap_list = appointment_list.filter(shift=sh) # фильтруем записи только этой смены
        time_list = get_time_list(ap_list) # получаем список занятого времени смены
        free_time_in_shift = [] # здесь будет все свободное время смены
        for t in list_of_times: # list_of_times - это список всего возможного времени в смене; берем каждое время из списка
            if t not in time_list: # смотрим, есть ли это время в списке занятого. Если нет, то...
                free_time_in_shift.append(t) # ... добавляем его в список свободного времени
        list_of_free_times_in_shifts.append(free_time_in_shift) # добавляем свободное время смены в свободное время даты
    ap_list = appointment_list.filter(shift=None) # берем записи без смены
    time_list = get_time_list(ap_list) # получаем список занятого времени записей без смены
    for t in time_list: # берем занятое время из записей без смены
        for sh in list_of_free_times_in_shifts: # берем все смены даты со свободным временем
            match_time = None # здесь будет совпавшее время
            for time in sh: # идем по всем записям свободного времени в смене
                if t == time: # если время записи без смены совпало со свободным временем в смене
                    match_time = time # запоминаем это время
                    break # прекращаем смотреть смену
            if match_time: # если совпавшее время было найдено
                sh.remove(match_time) # удаляем это время из свободного
                break # прекращаем смотреть это время записи без смены и идем к следующему
    # превращаем наш список в плоский без дубликатов
    free_time_list = sorted(list(set([time for sh in list_of_free_times_in_shifts for time in sh])))
    result_free_time_list = [] # здесь будет итог - все свободное время на дату
    rep = service.duration//30 # считаем длительность услуги, которую хочет клиент
    for time in free_time_list: # ходка по всем записям смены
        this_time = time # берем начальное время (время, которое смотрим сейчас как свободное для клиента)
        good_time = True # изначально считаем, что это время подходящее
        for _ in range(rep): # считаем все время записи по 30 минут, исходя из ее длительности
            minutes = this_time.minute + 30
            this_time = datetime.time(this_time.hour + minutes // 60, minutes % 60)
            if this_time not in free_time_list: # если полученное время не в списке свободного
                good_time = False # то считаем это время не подходящим
                break # завершаем цикл
        if good_time: # если это время в итоге осталось подходящим
            result_free_time_list.append(str(time).split(':')) # добавляем его в список свободного времени для клиента
    return HttpResponse(json.dumps(result_free_time_list))

def get_service_cost(request, id):
    service_cost = Service.objects.get(pk=id).cost
    return HttpResponse(str(service_cost))