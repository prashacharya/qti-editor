package eu.ydp.qtiPageEditor.client.controller;

import org.puremvc.java.multicore.interfaces.INotification;
import org.puremvc.java.multicore.patterns.command.SimpleCommand;

import eu.ydp.qtiPageEditor.client.model.QTIPageModelProxy;
import eu.ydp.qtiPageEditor.client.model.jso.SaveCallback;

public class SetSaveJSCallback extends SimpleCommand {
	
	public void execute(INotification notification){
		
		QTIPageModelProxy proxy = (QTIPageModelProxy)getFacade().retrieveProxy(QTIPageModelProxy.NAME);
		SaveCallback callback = (SaveCallback)notification.getBody();
		
		proxy.setSaveCallback(callback);
		
	}

}
