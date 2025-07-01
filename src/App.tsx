import React from 'react';
import { Input, Button, Card, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Link } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

interface UnbanRequest {
  id: string;
  email: string;
  userId: string;
  nickname: string;
  status: string;
  daysLeft: number;
}

export default function App() {
  const [email, setEmail] = React.useState("");
  const [userId, setUserId] = React.useState("");
  const [nickname, setNickname] = React.useState("");
  const [requests, setRequests] = React.useState<UnbanRequest[]>([]);
  const [currentRequest, setCurrentRequest] = React.useState<UnbanRequest | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showPaymentButton, setShowPaymentButton] = React.useState(false);
  const [showTrackingModal, setShowTrackingModal] = React.useState(false);
  const [trackingId, setTrackingId] = React.useState("");

  const handleUnban = (e: React.FormEvent) => {
    e.preventDefault();
    const newRequest: UnbanRequest = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      userId,
      nickname,
      status: "Pending",
      daysLeft: 5,
    };
    setRequests([...requests, newRequest]);
    setCurrentRequest(newRequest);
    onOpen();
  };

  const handlePayment = () => {
    setShowPaymentButton(true);
  };

  const handlePaid = () => {
    if (currentRequest) {
      const updatedRequests = requests.map(req =>
        req.id === currentRequest.id ? { ...req, status: "Processing" } : req
      );
      setRequests(updatedRequests);
      setShowPaymentButton(false);
      alert(`Your request number is: ${currentRequest.id}`);
      onClose();
    }
  };

  const handleTrackRequest = () => {
    setShowTrackingModal(true);
  };

  const checkStatus = () => {
    const request = requests.find(req => req.id === trackingId);
    if (request) {
      setCurrentRequest(request);
      onOpen();
    } else {
      alert("Request not found");
    }
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      setRequests(prevRequests =>
        prevRequests.map(req => {
          if (req.status === "Processing") {
            const newDaysLeft = Math.max(0, req.daysLeft - 1);
            return {
              ...req,
              daysLeft: newDaysLeft,
              status: newDaysLeft === 0 ? "Unbanned" : "Processing",
            };
          }
          return req;
        })
      );
    }, 5000); // Update every 5 seconds for demo purposes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md bg-gray-800 text-white">
          <form onSubmit={handleUnban} className="p-6 space-y-6">
            <div className="flex justify-center mb-6">
              <Icon icon="logos:epic-games" width="80" height="80" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-6">EpicGames Support Unlock</h2>
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onValueChange={setEmail}
              required
              className="bg-gray-700"
            />
            <Input
              type="text"
              label="ID"
              placeholder="Enter your ID"
              value={userId}
              onValueChange={setUserId}
              required
              className="bg-gray-700"
            />
            <Input
              type="text"
              label="Nickname"
              placeholder="Enter your nickname"
              value={nickname}
              onValueChange={setNickname}
              required
              className="bg-gray-700"
            />
            <Button
              type="submit"
              color="primary"
              className="w-full"
              startContent={<Icon icon="lucide:unlock" />}
            >
              Unban
            </Button>
          </form>
          <div className="px-6 pb-6">
            <Button
              color="secondary"
              className="w-full"
              onPress={handleTrackRequest}
              startContent={<Icon icon="lucide:search" />}
            >
              Track Request
            </Button>
          </div>
        </Card>
      </motion.div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {currentRequest && (
            <>
              <ModalHeader className="flex flex-col gap-1">Request Status</ModalHeader>
              <ModalBody>
                <p>Request ID: {currentRequest.id}</p>
                <p>Status: {currentRequest.status}</p>
                {currentRequest.status === "Processing" && (
                  <p>Estimated time: {currentRequest.daysLeft} days</p>
                )}
                {currentRequest.status === "Pending" && (
                  <p>To proceed, you need to pay 300 stars.</p>
                )}
                {currentRequest.status === "Unbanned" && (
                  <p>Your account has been unbanned!</p>
                )}
              </ModalBody>
              <ModalFooter>
                {currentRequest.status === "Pending" && !showPaymentButton && (
                  <Button color="primary" onPress={handlePayment}>
                    Pay 300 stars
                  </Button>
                )}
                {showPaymentButton && (
                  <>
                    <Link href="https://t.me/EpicGames_inc" target="_blank" rel="noopener noreferrer">
                      <Button color="primary">Go to Payment</Button>
                    </Link>
                    <Button color="secondary" onPress={handlePaid}>
                      I have paid
                    </Button>
                  </>
                )}
                <Button color="danger" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={showTrackingModal} onClose={() => setShowTrackingModal(false)}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Track Your Request</ModalHeader>
          <ModalBody>
            <Input
              type="text"
              label="Request ID"
              placeholder="Enter your request ID"
              value={trackingId}
              onValueChange={setTrackingId}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={checkStatus}>
              Check Status
            </Button>
            <Button color="danger" onPress={() => setShowTrackingModal(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}