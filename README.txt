# restart the fastapi backend process
sudo systemctl restart myapp-backend

# starts the logger
sudo journalctl -u myapp-backend -f

# service file path
/etc/systemd/system/myapp-backend.service
