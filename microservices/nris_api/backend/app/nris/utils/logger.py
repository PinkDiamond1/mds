from flask import current_app
from app.extensions import sched


#TODO validate this is working an intended on Openshift
def get_logger():
    if current_app:
        return current_app.logger
    elif sched.app:
        return sched.app.logger
    else:
        return None