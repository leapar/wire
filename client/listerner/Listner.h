#pragma once

#include "HCNetSDK.h"

class CListner
{
public:
	CListner(void);
	~CListner(void);

	void start(char* ip,char* pass,int port,char* center);
	void stop();
private:
	long m_listener;
	long m_userid;
};

