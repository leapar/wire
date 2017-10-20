#include<stdlib.h>
#include<stdio.h>
#include "Listner.h"

void main(int arg,char** args) {
	if(arg < 5) {
		printf("arg error: ip pass port center");
		getchar();
		return;
	}


	CListner listen;

	listen.start(args[1],args[2],atoi(args[3]),args[4]);

	getchar();

	listen.stop();
}