import CampaignOffers from "@/components/campaign/CampaignOffers";
import campaignData from "@/database/campaigns.json";

export default function CampaignPage() {
  return <CampaignOffers pageTitle={campaignData.pageTitle} campaigns={campaignData.campaigns} />;
}
