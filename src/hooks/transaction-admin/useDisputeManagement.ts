import { useState } from 'react';
import { Dispute } from '@/lib/data/paymentTypes';
import { DisputeResponse } from './types';
import { useToast } from '@/hooks/use-toast';
import { respondToDispute } from '@/services/admin/transactionAdminService';

export const useDisputeManagement = ({ 
  disputes, 
  setDisputes 
}: { 
  disputes: Dispute[], 
  setDisputes: React.Dispatch<React.SetStateAction<Dispute[]>>
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const respondToDisputeRequest = async ({
    disputeId,
    response,
    evidence
  }: DisputeResponse) => {
    setIsLoading(true);
    
    try {
      const result = await respondToDispute(disputeId, response, evidence);
      
      if (result.success) {
        // Update dispute status
        const updatedDisputes = disputes.map(d => {
          if (d.id === disputeId) {
            return {
              ...d,
              status: 'under_review' as Dispute['status'],
              updatedAt: new Date().toISOString(),
              adminNotes: (d.adminNotes ? d.adminNotes + '\n\n' : '') + 
                `Resposta enviada em ${new Date().toLocaleString()}: ${response}`
            };
          }
          return d;
        });
        
        setDisputes(updatedDisputes);
        
        toast({
          title: "Resposta enviada",
          description: "Sua resposta à disputa foi enviada com sucesso",
        });
        
        return updatedDisputes.find(d => d.id === disputeId);
      } else {
        toast({
          title: "Erro",
          description: result.message,
          variant: "destructive"
        });
        return null;
      }
    } catch (error) {
      console.error("Erro ao responder disputa:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar sua resposta",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    respondToDisputeRequest
  };
};
