from datetime import datetime, timedelta

from msal import PublicClientApplication
from rest_framework.response import Response
from rest_framework.views import APIView
import requests
from .models import Config, Calendars

config = Config()
calendars = Calendars()
config.FLOW['expires_at'] = 0
config.FLOW['expires_in'] = 10 ** 1000


class Login(APIView):

    is_logged = False

    @staticmethod
    def get(request):
        if not Login.is_logged:
            try:
                config.ACCESS_TOKEN = config.APP.acquire_token_by_device_flow(flow=config.FLOW)['access_token']
            except KeyError:
                return Response({'hasToken': False, 'link': config.FLOW['verification_uri'], 'code': config.FLOW['user_code']})

        if not Login.is_logged:
            get_all_calendars({'Authorization': 'Bearer ' + config.ACCESS_TOKEN})
            Login.is_logged = True

        return Response({'hasToken': True})


class Orange(APIView):
    @staticmethod
    def get(request):
        return Response(get_calendar(calendars.orange))


class Green(APIView):
    @staticmethod
    def get(request):
        return Response(get_calendar(calendars.green))


class Red(APIView):
    @staticmethod
    def get(request):
        return Response(get_calendar(calendars.red))


class Yellow(APIView):
    @staticmethod
    def get(request):
        return Response(get_calendar(calendars.yellow))


def get_calendar(room):
    if not Login.is_logged:
        return {'isLogged': False}
    context = get_calendar_this_week({
        'Authorization': 'Bearer ' + config.ACCESS_TOKEN,
        'Prefer': 'outlook.timezone="Asia/Yekaterinburg"'},
        room)
    return context


def get_all_calendars(headers):
    response = requests.get(f"https://graph.microsoft.com/v1.0/me/calendars", headers=headers)
    for item in response.json()["value"]:
        if item["name"] == calendars.orange['name']:
            calendars.orange["id"] = item["id"]
        elif item["name"] == calendars.green['name']:
            calendars.green["id"] = item["id"]
        elif item["name"] == calendars.red['name']:
            calendars.red["id"] = item["id"]
        elif item["name"] == calendars.yellow['name']:
            calendars.yellow["id"] = item["id"]


def get_calendar_this_week(headers, room=calendars.orange):
    now = datetime.fromordinal(datetime.now().toordinal())
    weak_day = datetime.weekday(now)
    start_datatime = now - timedelta(days=weak_day)
    end_datetime = now + timedelta(days=7 - weak_day)
    room_id = room['id']
    response = requests.get(
        f"https://graph.microsoft.com/v1.0/me/calendars/{room_id}/calendarView?startdatetime={start_datatime.isoformat()}&enddatetime={end_datetime.isoformat()}&$top=1000",
        headers=headers)
    return get_output_dict(response.json(), start_datatime, room)


def get_output_dict(content, start_datatime, room):
    output_dict = {"name": room['name'], "calendar": []}
    for i in range(0, 7):
        current_day = start_datatime + timedelta(days=i)
        current_day_str = str(current_day).partition(' ')[0]
        meetings = []
        try:
            content["value"]
        except KeyError:
            Login.is_logged = False
            global calendars
            config.APP = PublicClientApplication(client_id=config.CLIENT_ID, authority=config.AUTHORITY)
            config.FLOW = config.APP.initiate_device_flow(scopes=config.SCOPE)
            calendars = Calendars()
            config.FLOW['expires_at'] = 0
            config.FLOW['expires_in'] = 10 ** 1000
            print(content)

        for value in content["value"]:
            current_start = value["start"]["dateTime"].partition('T')
            current_start_day = current_start[0]
            if current_start_day > current_day_str:
                break
            if current_start_day == current_day_str:
                body_preview = value["bodyPreview"]
                name = ''
                phone = ''
                for j in range(0, len(body_preview)):
                    if body_preview[j].isdigit():
                        phone = body_preview[j:]
                        break
                    name += body_preview[j]
                meetings.append({
                    "start": current_start[2][0:5],
                    "end": value["end"]["dateTime"].partition('T')[2][0:5],
                    "name": name.strip(),
                    "phone": phone
                })
        current_day_obj = {"date": current_day_str, "meetings": meetings}
        output_dict["calendar"].append(current_day_obj)
    return output_dict
