package app

import (
	"os"
	"os/signal"
)

func GracefulShutdown(callback func(), sig ...os.Signal) <-chan struct{} {
	stop := make(chan struct{})
	sigChan := make(chan os.Signal, 1)

	sigs := sig
	if len(sigs) == 0 {
		sigs = []os.Signal{os.Interrupt}
	}

	signal.Notify(sigChan, sigs...)

	go func() {
		<-sigChan

		signal.Stop(sigChan)

		callback()

		close(sigChan)
		close(stop)
	}()

	return stop
}
