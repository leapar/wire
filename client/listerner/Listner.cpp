#include "Listner.h"
#include <windows.h>
#include <stdio.h>
#include "curl/curl.h"
#include <string>

char G_CENTER[128] = {0};

static int OnDebug(CURL *, curl_infotype itype, char * pData, size_t size, void *)  
{  
    if(itype == CURLINFO_TEXT)  
    {  
        //printf("[TEXT]%s\n", pData);  
    }  
    else if(itype == CURLINFO_HEADER_IN)  
    {  
        printf("[HEADER_IN]%s\n", pData);  
    }  
    else if(itype == CURLINFO_HEADER_OUT)  
    {  
        printf("[HEADER_OUT]%s\n", pData);  
    }  
    else if(itype == CURLINFO_DATA_IN)  
    {  
        printf("[DATA_IN]%s\n", pData);  
    }  
    else if(itype == CURLINFO_DATA_OUT)  
    {  
        printf("[DATA_OUT]%s\n", pData);  
    }  
    return 0;  
}  

static size_t OnWriteData(void* buffer, size_t size, size_t nmemb, void* lpVoid)  
{  
    std::string* str = dynamic_cast<std::string*>((std::string *)lpVoid);  
    if( NULL == str || NULL == buffer )  
    {  
        return -1;  
    }  
  
    char* pData = (char*)buffer;  
    str->append(pData, size * nmemb);  
    return nmemb;  
}  

void WINAPI  callBack (LONG lCommand,
					   NET_DVR_ALARMER *pAlarmer,  
					   char *pAlarmInfo,
					   DWORD dwBufLen,
					   void *pUser) {
						   printf("%d--%08X--%s\n",GetTickCount64(),lCommand,pAlarmer->sDeviceIP);
	std::string  strResponse;
	
	CURLcode res;  
    CURL* curl = curl_easy_init();  
    if(NULL == curl)  
    {  
        return;  
    }  
	std::string url = "http://";

	url += G_CENTER;

	url += ":3000/event?";

	//G_CENTER

	url.append("ip=");
	url.append(pAlarmer->sDeviceIP);
	url.append("&code=");
	char code[100] = {0};
	sprintf(code,"%ld",lCommand);
	url.append(code);

	//debug
     //   curl_easy_setopt(curl, CURLOPT_VERBOSE, 1);  
     //   curl_easy_setopt(curl, CURLOPT_DEBUGFUNCTION, OnDebug);  
    
		curl_easy_setopt(curl, CURLOPT_URL, url.c_str());  
    curl_easy_setopt(curl, CURLOPT_READFUNCTION, NULL);  
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, OnWriteData);  
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, (void *)&strResponse);  
    /** 
    * 当多个线程都使用超时处理的时候，同时主线程中有sleep或是wait等操作。 
    * 如果不设置这个选项，libcurl将会发信号打断这个wait从而导致程序退出。 
    */  
    curl_easy_setopt(curl, CURLOPT_NOSIGNAL, 1);  
    curl_easy_setopt(curl, CURLOPT_CONNECTTIMEOUT, 3);  
    curl_easy_setopt(curl, CURLOPT_TIMEOUT, 3);  
    res = curl_easy_perform(curl);  
    curl_easy_cleanup(curl);  
  
	
}

CListner::CListner(void)
{
}


CListner::~CListner(void)
{
}


void CListner::start(char* ip,char* pass,int port,char* center) {
	BOOL bResult = NET_DVR_Init();
	NET_DVR_DEVICEINFO_V30 struLocalDeviceInfo;

	memset(G_CENTER,0,sizeof(G_CENTER));
	strcpy(G_CENTER,center);


	memset(&struLocalDeviceInfo,0,sizeof(struLocalDeviceInfo));
	m_userid = NET_DVR_Login_V30(ip,8000,"admin",pass,&struLocalDeviceInfo);

//	char* ip = "172.29.225.25";

	m_listener = NET_DVR_StartListen_V30("0.0.0.0",port,callBack,NULL);

	long err = NET_DVR_GetLastError();
}

void CListner::stop() {
	NET_DVR_StopListen_V30(m_listener);
	NET_DVR_Logout(m_userid);
	NET_DVR_Cleanup();
}